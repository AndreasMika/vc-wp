<?php
error_reporting(E_ALL);

function readcache ($file, $time=86400){
    if (file_exists($file) && time() - $time < filemtime($file)) {
        return file_get_contents($file);
    } else {
        return false;
    }
}
function writecache ($file, $content){
    $fp = fopen($file, "w+");
    $z = fwrite($fp, $content);
    fclose($fp);
}


// prepare data
$cache_spritefile = readcache('../cache/sprite.txt');

if (!$cache_spritefile) {
    $cache_spritefile = file_get_contents('http://res.makler-bund.de/h1/_logos/_curr_sprite_name.txt');
    writecache ('../cache/sprite.txt', $cache_spritefile);
}
$cache_spritefile = 'http://res.makler-bund.de/h1/_logos/'.$cache_spritefile;

$cache_positions = readcache('../cache/positions.txt');
if (!$cache_positions) {
    $cache_positions = file_get_contents('http://res.makler-bund.de/h1/_logos/sprites.txt');
    writecache ('../cache/positions.txt', $cache_positions);
}

$array = explode("\n", $cache_positions);
$logoz = array();
foreach ($array as $k => $el) {
    $key = strtolower (preg_replace('/\s.*/', '', trim($el)));
    $val = preg_replace('/^\w+\s/U', '', trim($el));
    $logoz[$key] = $val;
}
//$array = array_map ('explodeTAB', $array);

$result = array ('logoimage'=>$cache_spritefile, 'lp'=>$logoz);
echo json_encode($result);
die();