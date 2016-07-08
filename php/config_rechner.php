<?php
##########################################################################
##        Einstellungen für die Rechner-Module von Mr-Money             ##
##########################################################################

# Modulpfade definieren
$module_pfad = "http://www.mr-money.de/module/"; # NICHT ÄNDERN

# Partnerid und Subid
$partnerid = "pp";
$subid = "";

# true = Speichert Eingaben bei späteren Wiederaufruf, false = jeder Aufruf beginnt mit leerer Maske
$config_Rechner['enable_input_cache'] = false;

# als Mögliche Codierungen sind momentan "iso-8859-1" und "utf-8" vorgesehen
$config_Rechner['Charset_Website'] = "iso-8859-1";

# Möglicher Pfad zur eigenen overlib.js : "pfad_overlib=https://www.mr-money.de/module/overlib.js"
$config_Rechner['parameter_java'] = "";

# Diese Variable kann mit zusätzlichen Header-Tags befüllt werden, die dann im HEAD der Seite geladen werden.
# In der Voreinstellung wird hier die mitgelieferte CSS-Datei geladen.
$config_Rechner['additional_html_head_tag'] = "<link rel=stylesheet media=\"screen\" href=\"css.css\">";

# feature im Beta-Stadium - Umbenennen der steuerung.php
# $config_Rechner['steuerung_alternativ'] = 'steuerung.php';

##########################################################################
##         Pfade zu Ihren CSS-Dateien mit http:// beginnend             ##
##        Diese Angaben müssen Sie an Ihre Dateien anpassen!            ##
##########################################################################

# Ihre CSS für das Antragsformular
$css_url_antrag = "http://www.mr-money.de/datenbank/daten_include_phpfiles/antrag.css";

##########################################################################
##           Pfade zu Ihren Rechnern mit http:// beginnend              ##
##        Diese Angaben müssen Sie an Ihre Dateien anpassen!            ##
##########################################################################

# Bauversicherung
$config_Rechner['path']['BAU']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/bauversicherung.php";
$config_Rechner['path']['BAU']['title'] = "Bauversicherung";

# Betriebshaftpflicht
$config_Rechner['path']['BHV']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/betriebshaftpflichtversicherung.php";
$config_Rechner['path']['BHV']['title']  = "Betriebshaftpflichtversicherung";

# Büroversicherung
$config_Rechner['path']['BUR']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/bueroversicherung.php";
$config_Rechner['path']['BUR']['title']  = "Büroversicherung";

# Elektronik
$config_Rechner['path']['ELE']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/elektronikversicherung.php";
$config_Rechner['path']['ELE']['title']  = "Elektronikversicherung";

# Feuerrohbaurechner
$config_Rechner['path']['FEU']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/feuerrohbau.php";
$config_Rechner['path']['FEU']['title'] = "Feuerrohbauversicherung";

# gewerbliche Gebäudeversicherung
$config_Rechner['path']['GGV']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/gewerbegebaeude.php";
$config_Rechner['path']['GGV']['title']  = "Gewerblichegebäudeversicherung";

# gewerbliche Rechtschutzversicherung
$config_Rechner['path']['GRS']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/gewerberechtsschutz.php";
$config_Rechner['path']['GRS']['title']  = "Gewerberechtsschutzversicherung";

# Haus- und Grundbesitzerhaftpflicht
$config_Rechner['path']['HUG']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/grundbesitzerhaft.php";
$config_Rechner['path']['HUG']['title']  = "Grundbesitzerhaftpflichtversicherung";

# Hausratversicherung
$config_Rechner['path']['HR']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/hausratversicherung.php";
$config_Rechner['path']['HR']['title']  = "Hausratversicherung";

# Betriebliche Inhaltsversicherung / Inventarversicherung
$config_Rechner['path']['INV']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/inventarversicherung.php";
$config_Rechner['path']['INV']['title']  = "Inventarversicherung";

# Maschinenversicherung
$config_Rechner['path']['MAS']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/maschinenversicherung.php";
$config_Rechner['path']['MAS']['title']  = "Maschinenversicherung";

# Gewässerschadenhaftpflicht / Öltank
$config_Rechner['path']['OEL']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/oeltankhaftpflicht.php";
$config_Rechner['path']['OEL']['title']  = "Öltank- / Umweltschadenhaftpflichtversicherung";

# Photovoltaikversicherung
$config_Rechner['path']['PHO']['link']  = "http://www.mr-money.de/datenbank/daten_include_phpfiles/photovoltaikversicherung.php";
$config_Rechner['path']['PHO']['title']  = "Photovoltaikversicherung";

# Reiseversicherung
$config_Rechner['path']['REI']['link']  = "http://www.mr-money.de/datenbank/daten_include_phpfiles/reiseversicherung.php";
$config_Rechner['path']['REI']['title']  = "Reiseversicherung";

# private Haftpflichtversicherung
$config_Rechner['path']['PHV']['link']  = "http://www.mr-money.de/datenbank/daten_include_phpfiles/privathaftpflicht.php";
$config_Rechner['path']['PHV']['title']  = "Privathaftpflichtversicherung";

# Rechtschutzversicherung
$config_Rechner['path']['RS']['link']  = "http://www.mr-money.de/datenbank/daten_include_phpfiles/rechtsschutz.php";
$config_Rechner['path']['RS']['title']  = "Rechtschutzversicherung";

# Risikolebensversicherung
$config_Rechner['path']['RLV']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/risikolebensversicherung.php";
$config_Rechner['path']['RLV']['title']  = "Risikolebensversicherung";

# Tierhalterhaftpflichtversicherung
$config_Rechner['path']['TIE']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/tierhalterhaftpflicht.php";
$config_Rechner['path']['TIE']['title']  = "Tierhalterhaftpflichtversicherung";

# Unfallversicherung
$config_Rechner['path']['UNF']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/unfallversicherung.php";
$config_Rechner['path']['UNF']['title']  = "Unfallversicherung";

# Wohngebäudeversicherung
$config_Rechner['path']['WG']['link'] = "http://www.mr-money.de/datenbank/daten_include_phpfiles/wohngebaeude.php";
$config_Rechner['path']['WG']['title']  = "Wohngebäudeversicherung";
