//Global vars
var smallScreen;
var currurl;
var windowWidth;
var windowWidthEM;
var windowheight;
var contentHeight;
var bodyHeight;
var productPage;

var isTouch = function () {
  return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
};


$(document).ready(function() {
    
    //SET PAGE VARIABLES
    windowWidth = $( window ).width();
    windowWidthEM = convertPxtoRem(windowWidth);
    windowheight = $( window ).height();
    bodyHeight = $( 'body' ).height();
    contentHeight = $('.main-content')[0].scrollHeight;
    currurl = window.location.pathname;

    //test to see if user is on invidividual product page
    usersPattern = new RegExp('^/products/.*');
    productPage = usersPattern.test(currurl);

    
    //SET GLOBAL MOBILE VARIABLE
    if (windowWidthEM < 42) {
        smallScreen = true;
    }else{
        smallScreen = false;
    }

    //SET MAIN PAGE ELEMENTS TO OPACITY 0 FOR PAGE TRANSITIONS
    $('.main-content').css('opacity', '0'); 
    $('.arrow-navigation').css('opacity', '0'); 
    $('.home-logo').css('opacity', '0'); 
});

/*  */
/* PAGE TRANSITION */
/*  */
var pageTransition = function(){
    
    $('.curtain').css('opacity', '0'); 
    $('.home-logo').css('opacity', '1'); 
    $('.left-small ').css('opacity', '1'); 
    $('.main-content').css('opacity', '1'); 
    $('.arrow-navigation').css('opacity', '1');
    $('.main-logo').css('opacity', '1');

}

///
//WINDOW LOAD AND RESIZE
///
$(window).on('load resize', function () {
    
    if(isTouch()) {
        $( '#icon-instagram').removeClass( 'scaleHover' );
        $( '#icon-twitter').removeClass( 'scaleHover' );
        $( '#icon-facebook').removeClass( 'scaleHover' );
        $( '#email').removeClass( 'quickFade' );
        $( '#productItem').removeClass('itemRollOver');
    }
    
    //PREVENT VIDEO FROM LOADING ON MOBILE
   if(isTouch()) { $('#video-container').css('display', 'none'); }
    
    //LOAD BACKGROUND/VIDEO ASSETS
    loadBkgrndAsset();

    //hide home link on home page
    if (currurl == '/') { 
        
        $('.home-logo').css('visibility', 'hidden'); 
    }else{
        $('.home-logo').css('visibility', 'visible'); 
    }
    
    if (currurl != '/locations') {
        
        $('.main-content').css('overflow-y', 'scroll'); 
    }
    
    if (currurl == '/locations') {
        
        document.getElementById('submit-button').addEventListener("click", sendZip);
        
        $('#loc-zip-field').bind("keyup keypress", function(e) {
            
          var code = e.keyCode || e.which; 
          if (code  == 13) {   
              sendZip();
            e.preventDefault();
            return false;
            }
        });
    }
    
    //check to activate arrow nav
    if ( productPage) { 
        $('.arrow-navigation').css('visibility', 'visible'); 
        
    };
        
    if ( productPage) { 
        productsReOrientation();
        window.addEventListener('orientationchange', productsReOrientation);
    }

    if ( currurl == '/locations') {
        
        updateMapSize();
        window.addEventListener("orientationchange", updateMapSize );
        initialize();
    }
    
    //expand fly out menu to full page width
    if(windowheight > bodyHeight) {
        $('.inner-wrap').height(windowheight);
    }else{
        $('.contentHeight').height(bodyHeight);
    }                                  
                                       
    //position nav arrows horizontally for mobile and desktop
    var arrowNavHeight = parseInt($('.arrow-back').css('height'), 10);
    $(".arrow-navigation").css("padding-top", (windowheight/2) - arrowNavHeight );  

});

var productsReOrientation = function() {

    if (window.orientation == '0') { 
        $('body').css('background-position', 'center top');
   
    }else if (window.orientation == '90' || window.orientation == '-90') { 
        $('body').css('background-position', 'center -180px');
        $('h1').css('padding-top', '5em');
       // $('body').css({"background-size":"100%"});
    }
    
}
             

var fillBackground =  function(){
    
    $('body').css('-webkit-background-size', 'cover');
    $('body').css('-moz-background-size', 'cover');
    $('body').css('-o-background-size', 'cover');
    $('body').css('background-size', 'cover');
}

var tileBackground =  function(){
    
    $('body').css('background-size', '100%, 100%');
}

var loadBkgrndAsset = function(){
    
    var newBkImage;
    var newTileImage;
    var videoAsset;
    var posterAsset;
    var prodBkgrndType;
    var amazonVideoURL = 'https://s3.amazonaws.com/schweidandsons.com/v2/videos/';
    var amazonPosterURL = 'https://s3.amazonaws.com/schweidandsons.com/v2/posters/';
   // var amazonVideoURL = '../local/AWS/videos/';
   // var amazonPosterURL = '../local/AWS/posters/';
        
    switch(currurl) {

            case '/products/the-all-natural':
                 newBkImage = 'mobile-angus-heritage-bg';
                 newTileImage = 'mobile-angus-heritage-tile-bg';
                 videoAsset = 'slate';
                 posterAsset = 'poster-angus-heritage-bg';
                 prodBkgrndType = 'tile';
                break;
            case '/products/grass-fed':
                 newBkImage = 'mobile-grass-fed-bg';
                 newTileImage = 'mobile-grass-fed-tile-bg';
                 videoAsset = 'grass';
                 posterAsset = 'poster-grass-fed-bg';
                 prodBkgrndType = 'tile';
                break;
            case '/products/one-percenter':
                 newBkImage = 'mobile-one-percenter-bg';
                 newTileImage = 'mobile-one-percenter-tile-bg';
                 videoAsset = 'pepper';
                 posterAsset = 'poster-one-percenter-bg';
                 prodBkgrndType = 'tile';
                break;
            case '/products/butchers':
                 newBkImage = 'mobile-butchers-bg';
                 newTileImage = 'mobile-butchers-tile-bg';
                 videoAsset = 'block';
                 posterAsset = 'poster-butchers-bg';
                 prodBkgrndType = 'tile';
                break;
            case '/products/abc':
                 newBkImage = 'mobile-abc-bg';
                 newTileImage = 'mobile-abc-bg';
                 videoAsset = 'buns';
                 posterAsset = 'poster-abc-bg';
                 prodBkgrndType = 'tile';
                break;
            case '/products/cab-custom-blend':
                 newBkImage = 'mobile-custom-bg';
                 newTileImage = 'mobile-custom-tile-bg';
                 videoAsset = 'coals';
                 posterAsset = 'poster-custom-bg';
                 prodBkgrndType = 'tile';
                break;
            case '/products/prime-burger':
                 newBkImage = 'mobile-prime-burger-bg';
                 newTileImage = 'mobile-prime-burger-tile-bg';
                 videoAsset = 'cloth';
                 posterAsset = 'poster-prime-burger-bg';
                 prodBkgrndType = 'tile';
                break;
            case '/products/signature-series':
                 newBkImage = 'mobile-signature-series-bg';
                 newTileImage = 'mobile-signature-series-tile-bg';
                 videoAsset = 'paper';
                 posterAsset = 'poster-signature-series-bg';
                 prodBkgrndType = 'tile';
                break;
            case '/products/cab-all-american':
                 newBkImage = 'mobile-steakhouse-bg';
                 newTileImage = 'mobile-steakhouse-tile-bg';
                 videoAsset = 'pan';
                 posterAsset = 'poster-steakhouse-bg';
                 prodBkgrndType = 'tile';
                break;
            default:
                 newBkImage = 'mobile-home-bg';
                 newTileImage ='';
                 videoAsset = 'http://schweidandsons.com.s3.amazonaws.com/video/v2/video';
                 posterAsset = 'poster-home-bg';
                 prodBkgrndType = 'fill';
            
        }
    
    //LOADS MOBILE BACKGROUND IMAGE
   if (isTouch() && smallScreen == true){

        if (prodBkgrndType == 'tile') {tileBackground()};
        if (prodBkgrndType == 'fill') {fillBackground()};

        var mobileBackgroundLoader = new PxLoader(), 
            backgroundImg = mobileBackgroundLoader.addImage('../images/mobile/'+newBkImage+'.jpg'),
            tileImg = mobileBackgroundLoader.addImage('../images/mobile/'+newTileImage+'.jpg');
         
        mobileBackgroundLoader.addCompletionListener(function() { 

            $('body').css('background-image', 'url('+backgroundImg.src+'), url('+tileImg.src+')');
            $('body').css('background-repeat', 'no-repeat, repeat-y');
            //$('body').css('background-position', 'center top');
            
            pageTransition();
            
        }); 

       mobileBackgroundLoader.start(backgroundImg, tileImg); 

    }else{
        //LOADS DESKTOP BACKGROUND IMAGE
        var video = document.getElementById('video-player');
        
        var newBackgroundImage = amazonPosterURL + posterAsset + '.jpg';
        var desktopBackgroundLoader = new PxLoader(), 
            backgroundImg = desktopBackgroundLoader.addImage(newBackgroundImage); 
        
        
        desktopBackgroundLoader.addCompletionListener(function() { 
            
            $('body').css({"background":"#333 url('"+newBackgroundImage+"') no-repeat center center fixed"});
            $('body').css({"-webkit-background-size":"cover"});
            $('body').css({"-moz-background-size":"cover"});
            $('body').css({"-o-background-size":"cover"});
            $('body').css({"background-size":"cover"});

            pageTransition();
            
        }); 
        
        desktopBackgroundLoader.start(); 
  
        //LOADS VIDEO BACKGROUND
        if(!isTouch()) {
            
            var videoURL;

            if (productPage == true) {
                videoURL = amazonVideoURL + videoAsset
            }else{
                videoURL = videoAsset
            }

            if ( video.canPlayType( 'video/mp4' ) ) {
                video.setAttribute("src", videoURL + '.mp4' );
            }else if ( video.canPlayType( 'video/webm' ) ) {
                video.setAttribute("src", videoURL + '.webm');
            }else if ( video.canPlayType( 'video/ogg ' ) ) {
                video.setAttribute("src", videoURL + '.ogv');
            }
        }

    }
}

/*  */
/* LOCATIONS SECTION */
/*  */
function updateMapSize() {

   contentHeight = $('.main-content')[0].scrollHeight;
   windowWidth = $( window ).width();

    var mapHeight; 
    
     if (isTouch() && smallScreen == true){
        
        if (window.orientation == '90' || window.orientation == '-90') { 

            mapHeight = windowheight - convertRem(4); 
             $('.loc-footer').css('display', 'none'); 

        }else if(window.orientation == '0') { 

            mapHeight = windowheight - convertRem(10);       
            $('#map-canvas').css('width', Math.round(windowWidth)); 
            $('.loc-footer').css('display', 'block'); 
        }
    }else{
        mapHeight = windowheight - convertRem(10);
    }

    $('#map-canvas').css('height', Math.round(mapHeight)); 
    $('.desktop-results').css('height', Math.round(mapHeight-convertRem(3))); 
   // $('.desktop-results').css('display', 'none'); 
    
}

/*  */
/* EM to PX CONVERTER */
/*  */
function getElementFontSize( context ) {
    // Returns a number
    return parseFloat(
        // of the computed font-size, so in px
        getComputedStyle(
            // for the given context
            context
            // or the root <html> element
            || document.documentElement
        )
        .fontSize
    );
}
function convertRem(value) {
    return convertEm(value);
}
function convertEm(value, context) {
    return value * getElementFontSize(context);
}

function getRootElementFontSize( ) {
    // Returns a number
    return parseFloat(
        // of the computed font-size, so in px
        getComputedStyle(
            // for the root <html> element
            document.documentElement
        )
        .fontSize
    );
}
function convertPxtoRem(value) {
    return value / getRootElementFontSize();
}

/*  */
/* ZIP Entry */
/*  */

function sendZip(e) {
    
    var passedZip = document.getElementById('loc-zip-field').value;
    
    $('#loc-zip-field').blur();
    
    //validate length of zip
    var lengthCheck = passedZip.toString();
    if( (lengthCheck.length == 5)) {
        console.log( 'pass to google API' );
        codeAddress(passedZip);
    }

}



