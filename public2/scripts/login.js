$( document ).ready(function() {

    console.log("coucou");

            function getCookie(name) {
              const value = `; ${document.cookie}`;
              const parts = value.split(`; ${name}=`);
              if (parts.length === 2) return parts.pop().split(';').shift();
            }

            console.log(getCookie("tokenContent"));
            if (getCookie("tokenIv") != undefined && getCookie("tokenContent") != undefined) {
                hTokenIv = getCookie("tokenIv");
                hTokenContent = getCookie("tokenContent");
                $.post("./verifToken",
                {
                  tokenIv: hTokenIv,
                  tokenContent: hTokenContent
                },
                function(data,status){
                    if (status=="success") {
                        if (data.error != "true") {
                            loadTemplate('rooms');
                        }
                    }
                });
            }

            //round 2
            var $registerForm = $("#registerForm");
            var $users = $("#users");
            var $username = $("#username");
            var $password = $("#password");
            var $error = $("#error");

            var rPassword = document.getElementById("rPassword");
            var rPassword2 = document.getElementById("rPassword2");
            var rUsername = document.getElementById("rUsername");
            var rSubmit = document.getElementById("rSubmit");

            var lPassword = document.getElementById("lPassword");
            var lUsername = document.getElementById("lUsername");
            var lSubmit = document.getElementById("lSubmit");

            $("#rSubmit").click(function() {
                $.post("./register",
                {
                  username: rUsername.value,
                  password: rPassword.value
                },
                function(data,status){
                    if (status=="success") {
                        if (data.error == "true") {
                            alert("Votre username est déjà utilisé");
                        } else {
                            alert("Vous êtes bien inscrit "+data.username+", vous pouvez vous connecter <3");
                        }
                    }
                });
            });

            $("#lSubmit").click(function() {
                $.post("./login",
                {
                  username: lUsername.value,
                  password: lPassword.value
                },
                function(data,status){
                    if (status=="success") {
                        if (data.error == "true") {
                            alert("Vos identifiants ne correspondent pas");
                        } else {
                            alert("pas erreur");
                            loadTemplate('rooms');
                        }
                    }
                });
            });

            function rCheck () {
                if (rPassword.value.length >= 8 && rPassword.value == rPassword2.value && rUsername.value.length >= 2) {
                    rSubmit.disabled = false;
                }
            }
            console.log("coucou3");
            $("#rPassword2").keyup(function() {
                console.log("jetape");
                if (this.value != rPassword.value) {
                    rSubmit.disabled = true;
                    this.style.border = "1px solid red";
                } else {
                    this.style.border = "1px solid green";
                }
                rCheck();
            });

            $("#rPassword").keyup(function() {
                if (this.value.length < 8) {
                    rSubmit.disabled = true;
                    this.style.border = "1px solid red";
                } else {
                    this.style.border = "1px solid green";
                }
                if (rPassword2.value != rPassword.value) {
                    rSubmit.disabled = true;
                    rPassword2.style.border = "1px solid red";
                } else {
                    rPassword2.style.border = "1px solid green";
                }
                rCheck();
            });

            $("#rUsername").keyup(function() {
                if (this.value.length < 2) {
                    rSubmit.disabled = true;
                    this.style.border = "1px solid red";
                } else {
                    this.style.border = "1px solid green";
                }
                rCheck();
            });

            function lCheck () {
                if (lPassword.value.length >= 8 && lUsername.value.length >= 2) {
                    lSubmit.disabled = false;
                }
            }

            $("#lPassword").keyup(function() {
                if (this.value.length < 8) {
                    lSubmit.disabled = true;
                    this.style.border = "1px solid red";
                } else {
                    this.style.border = "1px solid green";
                }
                lCheck();
            });

            $("#lUsername").keyup(function() {
                if (this.value.length < 2) {
                    lSubmit.disabled = true;
                    this.style.border = "1px solid red";
                } else {
                    this.style.border = "1px solid green";
                }
                lCheck();
            });

        });