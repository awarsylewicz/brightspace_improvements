// ==UserScript==
// @name         Brightspace Improvements
// @namespace    SAIT_ITSD
// @version      0.1
// @description  Includes many Brightspace improvements, including keeping the session alive, rearranging the assignments grading screen to make it user friendly, attendance stuff
// @author       Aaron Warsylewicz
// @match        https://learn.sait.ca/d2l/*
// @grant        none
// ==/UserScript==

/*
THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR
BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // keep the session alive by access the Brightspace home every 15 minutes
        setInterval(keepAlive, 900000);

        // automatically agree and login
        //login();

        //. for the assignment listing, always show everyone
        showEveryone();

        // resize and rearrange grading area
        rearrangeGrading();

        // add auto-fill for register setup (Ctrl-Alt-r)
        autofillRegister();

        // auto-fill all attendance data with "present" (Ctrl-Alt-p)
        autofillPresent();
    }, false);

})();

function keepAlive() {
    var e = document.getElementById("d2l_body");
    e.click();
}

function login() {
    var agreeId = document.getElementById("agreeId");
    if (agreeId != null) {
        document.getElementById("agreeId").click();
        document.getElementById("acceptId").click();
    }
}

function showEveryone() {
    var dropdown = document.getElementsByName("restrictUsers")[0];
    if (dropdown != null) {
        // only submit if selection = 0 (only users with submissions)
        if (dropdown.value == 0) {
            dropdown.selectedIndex = 1;
            dropdown.value = 1;
            document.getElementsByClassName("vui-input-search-button")[0].click();
        }
    }
}

function rearrangeGrading() {
    setTimeout(doRearrangeGrading, 500);
}

function doRearrangeGrading() {
    var root = document.getElementById("z_g");
    var e;

    if (root == null) {
        return;
    }

    var rightside = root.getElementsByClassName("dsl_pmh")[1];
    if (rightside != null) {
        rightside = rightside.children[0].children[0].children[0].children[0];
        //alert(gradingbox.innerHTML);
        rightside.style.position = "fixed";
        rightside.style.top = "0px";
        rightside.style.left = "600px";
        rightside.style.width = "800px";
        rightside.style.height = "100%";
        rightside.style.backgroundColor = "#cccccc";

        document.getElementById("feedback").style.width = "750px";

        rightside.style.fontSize = "smaller";

        var comments = rightside.getElementsByClassName("d_FG")[0].parent;
        if (comments != null) {
            alert('hi');
            comments.style.position = "fixed";
            comments.style.top = "400px";
            comments.style.left = "800px";
            comments.style.width = "50px";
        }

        // TODO: change publish button to publish and next
        //e = findElementByText("button", "Publish");
        //if (e != null) {
        //    alert(e.innerText);
        //}


    }


}

function findElementByText(tagType, text) {
    var e = null;
    var tags = document.getElementsByTagName(tagType);

    for (var i = 0; i < tags.length; i++) {
        if (tags[i].textContent == text) {
            e = tags[i];
            break;
        }
    }

    return e;
}

function autofillRegister() {
    document.addEventListener ("keydown", function (zEvent) {
        if (zEvent.ctrlKey && zEvent.altKey && zEvent.code === "KeyR") {
            var e = document.activeElement;
            var count = e.name.split("_")[1]; // get number of form element name
            var fillnew = false;

            for(var i = 1; i <= 14; i++) {
                for(var j = 1; j <= 3; j++) {
                    e = document.getElementsByName("name_" + count)[0];
                    if (fillnew === false && typeof e == 'undefined') {
                        fillnew = true;
                        count = 0;
                    }
                    if (fillnew) {
                        document.getElementsByName("name_new_" + count)[0].value = "Week " + i + " Day " + j;
                        document.getElementsByName("description_new_" + count)[0].value = "Week " + i + " Day " + j;
                    } else {
                        document.getElementsByName("name_" + count)[0].value = "Week " + i + " Day " + j;
                        document.getElementsByName("description_" + count)[0].value = "Week " + i + " Day " + j;
                    }
                    count++;
                }
            }
        }
    } );
}

function autofillPresent() {
    document.addEventListener ("keydown", function (zEvent) {
        if (zEvent.ctrlKey && zEvent.altKey && zEvent.code === "KeyP") {
            var i;
            var attendRE = /^SL_Status/;
            var attends=[],els=document.getElementsByTagName('*');
            for (i=els.length;i--;) if (attendRE.test(els[i].name)) attends.push(els[i]);

            for(var e of attends) {
                for (i = 0; i < e.options.length; i++) {
                    if (e.options[i].text === "P") {
                        // ensure box gets "clicked" so that it gets saved by Brightspace
                        // e.parentElement.parentElement.click();
                        // e.onchange();
                        e.selectedIndex = i;
                        e.onchange();
                    }
                }
            }

            els=document.getElementsByTagName('button');
            for (i=els.length;i--;) if (els[i].firstChild.nodeValue == "Save") els[i].click();
        }
    } );
}
