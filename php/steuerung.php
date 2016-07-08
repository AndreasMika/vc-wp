<?php
// ######################################################################################################################
// ##                      In dieser Datei sollten keine �nderungen vorgenommen werden.                               ###
// ##                      Alle Einstellungen erfolgen in der Datei config_rechner.php                                ###
// ##                      Einstellung https_partnerantrag.php erfolgt auf dem Server.                                ###
// ######################################################################################################################
// Versionslog:
// 2009-04-14 - Dirk - Aufruf f�r Antrag / Leistungsvergleich / Gesellschaftsinfo Anzeige �ber die eigene Domain �ber steuerung.php
// 2009-04-25 - Dirk - Aufruf f�r Fehlermeldelink und Angebotsfunktion in der Maklerversion �ber steuerung.php und flexibler Daten�brtragung mit jobact
// 2009-04-27 - Dirk - Aufruf f�r Protokollierung aus dem Antrag f�r Makler Abwicklung �ber steuerung.php
// 2009-09-25 - Chris - Pr�fung auf UTF-8 erweitert
// 2009-11-05 - Chris - Umleitung der Antr�ge nach steuerung.php, damit Umschaltung zwischen antrag5 und antrag7 gew�hrleistet werden kann
// 2009-11-06 - Chris - komplette Optimierung
// 2009-11-09 - Chris - POST-Aufruf umgestellt auf HTTP/1.0 um chunked encoding zu verhindern
// 2010-01-08 - Chris - Zus�tzlichen Header f�r Auslieferung �bertragener Daten eingebaut, falls die Kodierung in der Config von der des Webservers abweicht
// 2010-01-25 - Chris - Aufruf Antrag per HTTP statt HTTPS, da sonst manche Server nicht zugreifen k�nnen.
// 2010-11-04 - Tobias - Aufruf f�r Angebot (neues Layout) bei PHP-Aufruf hinzugef�gt 

//if(!file_exists("./config_rechner.php"))
//{
//	die("Fehler: Konfiguration nicht gefunden!");
//}
require_once(__DIR__ . "/config_rechner.php");

// Selbsttest
if (isset($_GET['test'])) {
  switch ($_GET['test']) {
    case 'QuellText':
      show_source("steuerung.php");
      break;
    case 'version':
      echo "v.2010-01-25";
      break;
  }
}

// Aufruf f�r Angebotsanzeige
if (isset($_REQUEST['act']) and $_REQUEST['act'] == "angebot") {
  // Variablen aus GET und POST zusammenf�hren
  while (list($key, $val) = each($_REQUEST)) {
    if ($key == "c_id") $val = $_GET[c_id];
    $link .= "&" . $key . "=" . rawurlencode($val);
  }
  readfile("http://www.mr-money.de/vgl/angebot.php?$link&cssurl=$cssurl");
}

// Antragsdokument darstellen
if (isset($_REQUEST['act']) and $_REQUEST['act'] == "antrag") {
//  Charset_header();
  $path_antrag = "http://www.mr-money.de/module/steuerung.php?" . $_SERVER['QUERY_STRING'] . "&cssurl=" . $css_url_antrag;
  $content = file_get_contents($path_antrag);
  echo Charset_encode($content);
}
// Aufruf nach Absenden des Antrages und Anzeige der Antwortseite
if (isset($_REQUEST['Auftrag']) and ($_REQUEST['Auftrag'] == "Versicherungsschutz beantragen - hier klicken" or $_REQUEST['Auftrag'] == "Angebot anfordern - hier klicken")) {
  Charset_header();
  $var = '';
  foreach ($_POST as $key => $val) {
    $var .= $key . "=" . rawurlencode(Charset_decode($val)) . "&";
  }
  $data['postv'] = $var;
  $content = Request_POST("www.mr-money.de", "/vgl/" . $_REQUEST['sp_lang'] . "/mailvgl.php", $data);
  echo Charset_encode($content);
}
// Leistungsvergleich
if (isset($_REQUEST['vergleichen']) and strlen($_REQUEST['vergleichen'])) {
  Charset_header();
  $content = Request_POST("www.mr-money.de", "/module/steuerung.php", $_REQUEST);
  echo Charset_encode($content);
}
// Aufruf f�r Fehlermeldelink und Angebotsfunktion in der Maklerversion �ber steuerung.php und flexibler Daten�brtragung mit jobact
if (isset($_REQUEST['jobact']) and strlen($_REQUEST['jobact'])) {
  Charset_header();
  $content = Request_POST("www.mr-money.de", "/module/" . $_REQUEST['jobact'] . ".php", $_REQUEST);
  echo Charset_encode($content);
}
// Anzeige PDF-Dokumente
if (isset($_REQUEST['jobpdf']) and strlen($_REQUEST['jobpdf'])) {
  header('Content-Type: application/pdf');
  header("Content-Disposition: attachment; filename=dokument.pdf");
  readfile("http://www.mr-money.de/module/" . $_REQUEST['jobpdf']);
}

function Charset_decode($content)
{
  switch (strtolower($GLOBALS['config_Rechner']['Charset_Website'])) {
    case "utf-8":
      return utf8_decode($content);
      break;
    default:
      return $content;
      break;
  }
}

function Charset_encode($content)
{
  switch (strtolower($GLOBALS['config_Rechner']['Charset_Website'])) {
    case "utf-8":
      return utf8_encode($content);
      break;
    default:
      return $content;
      break;
  }
}

function Charset_header()
{
  switch (strtolower($GLOBALS['config_Rechner']['Charset_Website'])) {
    case "utf-8":
      header("Content-Type: text/html; charset=UTF-8");
      break;
    default:
      header("Content-Type: text/html; charset=ISO-8859-1");
      break;
  }
}

function Request_POST($host, $path, $data)
{
  $string = '';
  foreach ($data as $key => $val) {
    $string .= $key . "=" . rawurlencode($val) . "&";
  }
  $fp = fsockopen($host, 80);
  $res = "";
  if ($fp) {
    fputs($fp, "POST " . $path . " HTTP/1.0\r\n");
    fputs($fp, "Host: " . $host . "\r\n");
    fputs($fp, "Content-type: application/x-www-form-urlencoded\r\n");
    fputs($fp, "Content-length: " . strlen($string) . "\r\n");
    fputs($fp, "Connection: close\r\n\r\n");
    fputs($fp, $string);
    while (!feof($fp)) {
      $res .= fgets($fp, 128);
    }
    fclose($fp);
  }

  $array = explode("\r\n\r\n", $res, 2);
  return $array[1];
}

?>
