<?php
error_reporting(0);

//function readcache ($file, $time=86400){
//    if (file_exists($file) && time() - $time < filemtime($file)) {
//        return file_get_contents($file);
//    } else {
//        return false;
//    }
//}
//function writecache ($file, $content){
//    $fp = fopen($file, "w+");
//    $z = fwrite($fp, $content);
//    fclose($fp);
//}




// prepare data
//$cache_spritefile = readcache('../cache/sprite.txt');
//
//if (!$cache_spritefile) {
//    $cache_spritefile = file_get_contents('http://res.makler-bund.de/h1/_logos/_curr_sprite_name.txt');
//    writecache ('../cache/sprite.txt', $cache_spritefile);
//}
//$cache_spritefile = 'http://res.makler-bund.de/h1/_logos/'.$cache_spritefile;
//
//$cache_positions = readcache('../cache/positions.txt');
//if (!$cache_positions) {
//    $cache_positions = file_get_contents('http://res.makler-bund.de/h1/_logos/sprites.txt');
//    writecache ('../cache/positions.txt', $cache_positions);
//}
//
//$array = explode("\n", $cache_positions);
//$logoz = array();
//foreach ($array as $k => $el) {
//    $key = strtolower (preg_replace('/\s.*/', '', trim($el)));
//    $val = preg_replace('/^\w+\s/U', '', trim($el));
//    $logoz[$key] = $val;
//}
//
//$result = array ('logoimage'=>$cache_spritefile, 'lp'=>$logoz);
//echo json_encode($result);
//die();

if (!$_GET['t']) {die();}
$t = addslashes($_GET['t']);


//header( "Content-Type: text/plain; charset=UTF-8" );
$pre_data = new stdClass;


//$UpdateParams = array (
//    "dataUser" => array (
//        'user' => '00204581',
//        'pass' => 'gZu74EdsWq',
//    ),
//    "content"  => array (
//        'gesellschaften' => array (
//            'fetchList' => array(
//                array(
//                    "sparte" => "phv",
//                    "subid" => ""
//                )
//            )
//        )
//    ),
//);


$UpdateParams = array (
    "dataUser" => array (
        'user' => '00204581',
        'pass' => 'gZu74EdsWq',
    ),
    "content"  => array (
        'gesellschaften' => array (
            'getRating' => array(
                array(
                    "sparte" => "phv",
                    "gesellschaft" => $t,
                    "subid" => ""
                )
            )
        )
    )
);

$url = 'https://api.versicherungsmaklersoftware.de/';

$response = curlSend( json_encode( $UpdateParams ), $url );

$data = json_decode( $response, true );


function getStarClass ($i, $rv) {
    $r = '';
    if ($rv >= $i+.5) {$r='half';}
    if ($rv >= $i+1)  {$r='full';}
    return $r;
}

if ($n = $data['response']['gesellschaften']['getRating'][0]['kategorien']) {

    $html = '<table class="ratingsTable">';

    foreach ($n as $k=>$eee){
        $html.='<tr><td class="subsection">'.$k.'</td><td class="subsection"></td></tr>';
        foreach ($eee as $el) {

			$rating = '<div class="rating">'.
                            '<div class="onestar '.getStarClass(0, $el['bewertung']).'"></div>'.
                            '<div class="onestar '.getStarClass(1, $el['bewertung']).'"></div>'.
                            '<div class="onestar '.getStarClass(2, $el['bewertung']).'"></div>'.
                            '<div class="onestar '.getStarClass(3, $el['bewertung']).'"></div>'.
                            '<div class="onestar '.getStarClass(4, $el['bewertung']).'"></div>'.
                       '</div>';

            $html.='<tr><td>'.$el['name'].'</td><td>'.$rating.'</td></tr>';
        }

    }


    $html .= '</table>';
    $html .= '<style>#cboxLoadedContent {overflow:hidden !important;}</style>';

    echo $html;
}




function curlSend( $content, $url )
{
    $headers = array ( "POST " . dirname( $url ) . " HTTP/1.0",
        "Content-type: application/json;charset=\"utf-8\"",
        "Accept: application/json",
        "Cache-Control: no-cache",
        "Pragma: no-cache",
        "Content-length: " . strlen( $content )
    );

    $ch = curl_init();
    curl_setopt( $ch, CURLOPT_URL, $url );
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt( $ch, CURLOPT_TIMEOUT, 60 );
    curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
    # curl_setopt( $ch, CURLOPT_USERAGENT, $defined_vars['HTTP_USER_AGENT'] );

    curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
    curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, 2 );
    curl_setopt( $ch, CURLOPT_POST, 1 );
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $content );

    $data = curl_exec( $ch );

    if ( curl_errno( $ch ) ) {
//        print "Error: " . curl_error( $ch );
        return false;
    } else {
        curl_close( $ch );

        return $data;
    }
}


