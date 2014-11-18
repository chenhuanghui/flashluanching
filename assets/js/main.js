// var access_token = getCookie("access_token");
// var access_token = "nlbtQBJ5qmNnbqd6ojrtMb7BPxGANqs8tp3tCUHWHce85wk3WhZu8RsApzXzElcpILXlgeBO9inS4qoD84jQX7bYfWqkSCEQ5w4FX7CNnDnnup1PVWQ7rXUPstUDBKQG";
var access_token = "Luz6sOPu5onz6Kv6bka4ko4Z23SCkv9IHh73ZXNDSGYG1oPKBLEdstiUQLedzYhWPuJqHrOZaRM70l7boscFhV0dogrsgQlmEm3PKinQDGfs8I1zc03RIIg7hXFNMAbY";
var full_name = "Duong Truong"
var domain = "http://localhost:1337/";

function removeCookie(name) {
    document.cookie = encodeURI(name) + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
}

function setCookie(cname, cvalue, exdays) {
    var expires = "";
    if(exdays !== 0)
    {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        expires = ";expires=" + d.toGMTString();
    }

    document.cookie = encodeURI(cname) + "=" + encodeURI(cvalue) + expires + ";path=/";
}

function getCookie(cname) {
    var name = encodeURI(cname) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return decodeURI(c.substring(name.length, c.length));
    }

    return undefined;
}

function init(){
    $("#registerBtn").on('click', function(event){register(event)});
    $("#loginBtn").on('click', function(event){login(event)});
    $("#updateProfileBtn").on('click', function(event){updateProfile(event)});
    $(".fullname").html(full_name);

}

function homeInit(){
    getLastestPhotos();
    $("#None").on('click', function(event){
        event.preventDefault();
        applyFilter('None');
    });
    $("#Bright").on('click', function(event){
        event.preventDefault();
        applyFilter('Bright');
    });
    $("#BW").on('click', function(event){
        event.preventDefault();
        applyFilter('BW');
    });
    $("#Sepia").on('click', function(event){
        event.preventDefault();
        applyFilter('Sepia');
    });
    $("#MultiplyBlue").on('click', function(event){
        event.preventDefault();
        applyFilter('MultiplyBlue');
    });
    $("#MultiplyYellow").on('click', function(event){
        event.preventDefault();
        applyFilter('MultiplyYellow');
    });
    $("#DoutoneBlue").on('click', function(event){
        event.preventDefault();
        applyFilter('DoutoneBlue');
    });
    $("#DoutoneYellow").on('click', function(event){
        event.preventDefault();
        applyFilter('DoutoneYellow');
    });
    $("#image-input").on('change', function(event){loadImg(event);});
    $("#toStep2").on('click', function(event){
        $("#step1-section").hide();
        $("#step3-section").hide();
        $("#step2-section").show();
    });
    $("#toStep3").on('click', function(event){
        $("#step1-section").hide();
        $("#step2-section").hide();
        uploadImage(event);
    });
    $("#completeUpload").on('click', function(event){
        $("#step1-section").hide();
        $("#step2-section").hide();
        $("#step3-section").hide();
    });
}

function register(e){
    e.preventDefault();
    $("#register-form-message").hide();

    if(!$('#agree-tou').is(':checked')){
        $("#register-form-message").html("Vui lòng đồng ý với các điều khoản của chương trình");
        $("#register-form-message").show();
    } else {
        var user = {
            name: $("#fname").val(),
            dob: $("#dob").val(),
            email: $("#email").val(),
            gender: $("#gender").val(),
            password: $("#password").val(),
            phone: $("#phone").val(),
            fbId: $("#fbId").val()
        }
        if(user.name && user.dob && user.email && user.gender && user.password && user.phone){
            $.post( "http://localhost:1337/user", user)
            .done(function(data) {
                $('#registerForm').modal('hide');
                $('#loginForm').modal('show');
                $.post( "http://localhost:1337/oauth/token", user)
                .done(function(data) {
                    setCookie('access_token', data.access_token, 7);
                    $.post( "http://localhost:1337/info/me?access_token="+data.access_token)
                    .done(function(info){
                        setCookie('name', info.name, 7);
                    });
                });
            }).fail(function(data)
            {
                if(data.invalidAttributes.email[0].rule == "unique"){
                    $("#register-form-message").html("Rất tiếc! Địa chỉ email này đã được sử dụng để đăng ký!");
                    $("#register-form-message").show();
                } else {
                    $("#register-form-message").html("Máy chủ đang quá tải và không thể tiếp nhận đăng ký mới, vui lòng thử lại sau.");
                    $("#register-form-message").show();
                }
            });
        } else {
            $("#register-form-message").html("Vui lòng điền đẩy đủ thông tin!");
            $("#register-form-message").show();
        }
    }
}

function login(e){
    e.preventDefault();
    $("#login-form-message").hide();
    var user = {
        grant_type: "password",
        client_id: "9KADSDFV1A",
        client_secret: "mnrTDN0KDSfmNz8CLGavBY4e8WA0mQ",
        username: $("#loginEmail").val(),
        password: $("#loginPassword").val()
    }
    console.log(user);
    if(user.username && user.password){
        $.post( domain+"oauth/token", user)
        .done(function(data) {
            setCookie('access_token', data.access_token, 30);
            $.post( domain+"info/me?access_token="+data.access_token)
            .done(function(info){
                setCookie('name', info.name, 30);

                $("#ip-login-register").hide();
                $("#ip-logout").show();

                $("#div-greeting").show();
                $("#div-warning").hide();
                $("#btn-order").removeAttr('disabled');
            });
            $('#loginForm').modal('hide');
        }).fail(function(data)
        {
            if(data.error){
                $("#login-form-message").html("Email hoặc password không chính xác");
                $("#login-form-message").show();
            } else {
                $("#login-form-message").html("Máy chủ đang quá tải, vui lòng thử lại sau");
                $("#login-form-message").show();
            }
        });
    } else {
        $("#login-form-message").html("Vui lòng nhập đẩy đủ thông tin!");
        $("#login-form-message").show();
    }
}

function updateProfile(e){
    e.preventDefault();
    $("#update-profile-form-message").hide();
    var user = {
        oldPwd: $("#edit-opwd").val(),
        newPwd: $("#edit-npwd").val(),
        name: $("#edit-fname").val(),
        email: $("#edit-email").val(),
        phone: $("#edit-phone").val(),
        fbId: $("#edit-fbId").val()
    }

    if(!user.oldPwd){
        $("#update-profile-form-message").html("Vui lòng nhập mật khẩu");
        $("#update-profile-form-message").show();
    } else {
        if(user.newPwd)
            if(user.newPwd != $("#edit-cfpwd").val()){
                $("#update-profile-form-message").html("Mật khẩu xác nhận không khớp");
                $("#update-profile-form-message").show();
                return;
            }

        $.post( domain+"user/update?access_token="+access_token, user)
        .done(function(data) {
            $('#profileForm').modal('hide');
            setCookie('name', data[0].name, 7);
        }).fail(function(data)
        {
            if(data.error){
                $("#update-profile-form-message").html("Mật khẩu cũ không chính xác");
                $("#update-profile-form-message").show();
            } else {
                $("#update-profile-form-message").html("Máy chủ đang quá tải, vui lòng thử lại sau");
                $("#update-profile-form-message").show();
            }
        });

    }

    var user = {
        grant_type: "password",
        client_id: "W7BTP42QXQ",
        client_secret: "wzqLDAojAXVYqw8fWJLy2erqkmA4gB",
        username: $("#loginEmail").val(),
        password: $("#loginPassword").val()
    }
    if(user.username && user.password){
        $.post( domain+"oauth/token", user)
        .done(function(data) {
            setCookie('access_token', data.access_token, 30);
            $.post( domain+"info/me?access_token="+data.access_token)
            .done(function(info){
                setCookie('name', info.name, 30);
            });
            $('#loginForm').modal('hide');
        }).fail(function(data)
        {
            if(data.error){
                $("#login-form-message").html("Email hoặc password không chính xác");
                $("#register-form-message").show();
            } else {
                $("#register-form-message").html("Máy chủ đang quá tải, vui lòng thử lại sau");
                $("#register-form-message").show();
            }
        });
    } else {
        $("#register-form-message").html("Vui lòng nhập đẩy đủ thông tin!");
        $("#register-form-message").show();
    }
}

function initGrid(){
    $("#grid").empty();
    $("#grid").append('<li class="title-box"><h2><a href="javascript:;" class="selected" onclick="getLatestPhotos();"">Mới nhất</a><br/><a href="javascript:;" onclick="getTopPhotos();">Thích nhiều nhất</a></h2></li>')

}

function getLastestPhotos(){
    initGrid();
    $.get( domain+"image?sort=createdAt%20DESC")
    .done(function(data) {
        for(var i=0; i<data.length; i++){
            $("#grid").append('<li><figure class="effect-zoe"><a href="entry.html?id='+data[i].id+'"><img src="'+data[i].url+'"/><a/><figcaption><h2 style="font-size:20px;max-width=165px;">'+data[i].owner.name+'</h2><p class="icon-links"><a href="#"><span class="icon-heart"></span></a><a href="#"><span class="icon-eye"></span></a><a href="#"><span class="icon-paper-clip"></span></a></p><p class="description">Zoe never had the patience of her sisters. She deliberately punched the bear in his face.</p></figcaption></figure></li>');
        }
        new GridScrollFx( document.getElementById( 'grid' ), {
            viewportFactor : 0.4
          } );

    }).fail(function(data)
    {
        console.log("Rất tiếc, máy chủ đang quá tải. Vui lòng truy cập sau giây lát để tải hình.")
    });
}

function getTopPhotops(){
    initGrid();
    $.get( domain+"image?sort=voteCount%20DESC")
    .done(function(data) {
        for(var i=0; i<data.length; i++){
            $("#grid").append('<li><figure class="effect-zoe"><a href="entry.html?id='+data[i].id+'"><img src="'+data[i].url+'"/><a/><figcaption><h2>'+data[i].owner.name+'</h2><p class="icon-links"><a href="#"><span class="icon-heart"></span></a><a href="#"><span class="icon-eye"></span></a><a href="#"><span class="icon-paper-clip"></span></a></p><p class="description">Zoe never had the patience of her sisters. She deliberately punched the bear in his face.</p></figcaption></figure></li>');
        }
        new GridScrollFx( document.getElementById( 'grid' ), {
            viewportFactor : 0.4
          } );

    }).fail(function(data)
    {
        console.log("Rất tiếc, máy chủ đang quá tải. Vui lòng truy cập sau giây lát để tải hình.")
    });
}

var photo = '#filtered-img',
    f;


// Use the fileReader plugin to listen for
// file drag and drop on the photo div:
// function loadImg(){

//     var img = $('<img>').appendTo(photo),
//     // var img = $('#filtered-img'),
//         imgWidth, newWidth,
//         imgHeight, newHeight,
//         ratio;

//     // Remove canvas elements left on the page
//     // from previous image drag/drops.

//     photo.find('canvas').remove();
//     filters.removeClass('active');

//     // When the image is loaded successfully,
//     // we can find out its width/height:

//     img.load(function() {

//         imgWidth  = this.width;
//         imgHeight = this.height;

//         // Calculate the new image dimensions, so they fit
//         // inside the maxWidth x maxHeight bounding box

//         if (imgWidth >= maxWidth || imgHeight >= maxHeight) {

//             // The image is too large,
//             // resize it to fit a 500x500 square!

//             if (imgWidth > imgHeight) {

//                 // Wide
//                 ratio = imgWidth / maxWidth;
//                 newWidth = maxWidth;
//                 newHeight = imgHeight / ratio;

//             } else {

//                 // Tall or square
//                 ratio = imgHeight / maxHeight;
//                 newHeight = maxHeight;
//                 newWidth = imgWidth / ratio;

//             }

//         } else {
//             newHeight = imgHeight;
//             newWidth = imgWidth;
//         }

//         // Create the original canvas.

//         originalCanvas = $('<canvas>');
//         var originalContext = originalCanvas[0].getContext('2d');

//         // Set the attributes for centering the canvas

//         originalCanvas.attr({
//             width: newWidth,
//             height: newHeight
//         }).css({
//             marginTop: -newHeight/2,
//             marginLeft: -newWidth/2
//         });

//         // Draw the dropped image to the canvas
//         // with the new dimensions
//         originalContext.drawImage(this, 0, 0, newWidth, newHeight);

//         // We don't need this any more
//         img.remove();

//         filterContainer.fadeIn();

//         // Trigger the default "normal" filter
//         filters.first().click();
//     });

//     // Set the src of the img, which will
//     // trigger the load event when done:

//     img.attr('src', "../img/test.png");
//     }

// // Listen for clicks on the filters

// filters.click(function(e){

//     e.preventDefault();

//     var f = $(this);

//     if(f.is('.active')){
//         // Apply filters only once
//         return false;
//     }

//     filters.removeClass('active');
//     f.addClass('active');

//     // Clone the canvas
//     var clone = originalCanvas.clone();

//     // Clone the image stored in the canvas as well
//     clone[0].getContext('2d').drawImage(originalCanvas[0],0,0);


//     // Add the clone to the page and trigger
//     // the Caman library on it

//     photo.find('canvas').remove().end().append(clone);

//     var effect = $.trim(f[0].id);

//     Caman(clone[0], function () {

//         // If such an effect exists, use it:

//         if( effect in this){
//             this[effect]();
//             this.render();

//             // Show the download button
//             // showDownload(clone[0]);
//         }
//         else{
//             // hideDownload();
//         }
//     });

// });


function loadImg(evt){
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById("filtered-img").src = fr.result;
        }
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
}

function applyFilter(filter){
    if(f){
        f.update(function() {
            this.reset();
            switch(filter){
                case 'None':
                    this.render();
                    break;
                case 'Bright':
                    this.brighten(40)
                        .saturate(50)
                        .render();
                    break;
                case 'BW':
                    this.saturate(-100)
                        .render();
                    break;
                case "Sepia":
                    this.sepia()
                        .render();
                    break;
                case 'MultiplyBlue':
                    var l = this.dup(); // make duplicate layer
                    l.fill(180, 255, 255);
                    this.contrast(20)
                        .saturate(-100)
                        .layer("multiply", l)
                        .render();
                    break;
                case 'MultiplyYellow':
                    var l = this.dup(); // make duplicate layer
                    l.fill(255, 245, 200);
                    this.contrast(20)
                        .saturate(-100)
                        .layer("multiply", l)
                        .render();
                    break;
                case 'DoutoneBlue':
                    var l = this.dup(); // make duplicate layer
                    l.fill(180, 255, 255);
                    this.contrast(20)
                        .saturate(-100)
                        .layer("overlay", l)
                        .render();
                    break;
                case 'DoutoneYellow':
                    var l = this.dup(); // make duplicate layer
                    l.fill(255, 245, 200);
                    this.contrast(20)
                        .saturate(-100)
                        .layer("overlay", l)
                        .render();
                    break;
            }
        });
    }
    else {
        f = Filtrr2(photo, function() {
            switch(filter){
                case 'None':
                    this.render();
                    break;
                case 'Bright':
                    this.brighten(40)
                        .saturate(50)
                        .render();
                    break;
                case 'BW':
                    this.saturate(-100)
                        .render();
                    break;
                case 'Sepia':
                    this.sepia()
                        .render();
                    break;
                case 'MultiplyBlue':
                    var l = this.dup(); // make duplicate layer
                    l.fill(180, 255, 255);
                    this.contrast(20)
                        .saturate(-100)
                        .layer("multiply", l)
                        .render();
                    break;
                case 'MultiplyYellow':
                    var l = this.dup(); // make duplicate layer
                    l.fill(255, 245, 200);
                    this.contrast(20)
                        .saturate(-100)
                        .layer("multiply", l)
                        .render();
                    break;
                case 'DoutoneBlue':
                    var l = this.dup(); // make duplicate layer
                    l.fill(180, 255, 255);
                    this.contrast(20)
                        .saturate(-100)
                        .layer("overlay", l)
                        .render();
                    break;
                case 'DoutoneYellow':
                    var l = this.dup(); // make duplicate layer
                    l.fill(255, 245, 200);
                    this.contrast(20)
                        .saturate(-100)
                        .layer("overlay", l)
                        .render();
                    break;
            }
        });
    }
}

function uploadImage(event){
    $("#loading").show();
    var canvas = document.getElementById('filtrr2-filtered-img');
    var imgBase64 = "";
    if(canvas)
        imgBase64 = canvas.toDataURL();
    else
        imgBase64 = $("#filtered-img").attr('src');
    var img = {
        image: imgBase64,
        caption: $("#image-caption").val(),
    }
    $.post( domain+"image/upload?access_token="+access_token, img)
    .done(function(data) {
        $("#loading").hide();
        $("#step3-section").show();
    }).fail(function(data)
    {
        console.log("Rất tiếc, máy chủ đang quá tải. Vui lòng truy cập sau giây lát để tải hình.")
    });
}

// Init FB
window.fbAsyncInit = function() {
    FB.init({
      appId      : '558176450992857',
      xfbml      : true,
      version    : 'v2.2'
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
// End Init FB

function loginFB (form) {     
  FB.login(function(response) {
      if(response.status === "connected")
      {
          FB.api('/me', function(response) 
              {
                var dob = '';
                if (typeof response.birthday != 'undefined') {
                    var dobElems = response.birthday.split("/");
                    dob = dobElems[1]+"/"+dobElems[0]+"/"+dobElems[2];                            
                }

                var email = undefined;
                if (typeof response.email != 'undefined') {
                    email = response.email;
                }

                switch(form)
                {
                  case 1:
                    setRegisterForm(response.id, response.name, response.email, dob, response.gender);
                    break;
                  case 3:
                    setProfileForm(response.id, response.name, response.email, dob, response.gender);
                    break
                }
                
              });
      }
  }, {scope:'email,user_birthday,user_location'});            
}

function setRegisterForm (id, name, email, dob, gender) {
  $("#fbId").val(id);
  $("#fname").val(name);
  if(dob != '')
  {
      $("#dob").val(dob);
  }

  if (email != 'undefined') {
      $("#email").val(email);
  }             
  
  if(gender === "male")
    gender = 'true';
  else
    gender = 'false';
  $("#gender").val(gender);
}

function setProfileForm (id, name, email, dob, gender) {
  $("#edit-fname").val(name);

  if (email != 'undefined') {
      $("#edit-email").val(email);
  }
}