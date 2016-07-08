<?php

error_reporting(E_ALL);

//header('Content-Type: application/xml; charset=utf-8');

$request = $_REQUEST;

if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
  $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
  $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
  $ip = $_SERVER['REMOTE_ADDR'];
}

if($ip == "::1") {
  $ip = "127.162.0.1";
}

$request["IP_USER"] = $ip . "-" . rand("11111", "99999");
$url = $request["action"];

unset($request["action"]);
unset($request["connect_sid"]);
unset($request["wp-settings-time-1"]);
unset($request["i18next"]);
unset($request["referer"]);
unset($request["refererQuery"]);
unset($request["VZL_FLASH"]);
unset($request["selectedTarif"]);

foreach($request as $key => $value) {
  if(strpos($key, "wordpress") !== false) {
    unset($request[$key]);
  }
}

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_POSTFIELDS, $request);
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$resp = curl_exec($curl);
echo str_replace('ISO-8859-1', 'UTF-8', utf8_encode($resp));
curl_close($curl);