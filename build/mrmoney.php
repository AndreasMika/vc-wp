<?php
/*
* Plugin Name: MrMoney
* Description: MrMoney API
* Version: 0.11
* Author: Alexander Frischbutter
* Author URI: http://fincha.com
*/

require_once('titan-framework-checker.php');

function mrmoney_create_options()
{
  $themeName = "mrmoney";
  $titan = TitanFramework::getInstance($themeName);

  $panel = $titan->createAdminPanel( array(

    'name' => 'MrMoney',

  ) );

  $panel->createOption( array(
    'name' => __( 'Checkout Page', $themeName),
    'id' => 'checkout_page',
    'type' => 'select-pages',
  ) );

  $panel->createOption( array(
    'name' => __( 'Compare Page', $themeName),
    'id' => 'compare_page',
    'type' => 'select-pages',
  ) );

  $panel->createOption( array(

    'type' => 'save'

  ) );

  // We create all our options here
}

function add_form($atts)
{
  $themeName = "mrmoney";
  $titan = TitanFramework::getInstance($themeName);

  $a = shortcode_atts(array(
    'type' => 'phv'
  ), $atts);

  $pluginpath = plugins_url() . '/mrmoney/';
  $checkout = $titan->getOption("checkout_page");
  $compare = $titan->getOption("compare_page");
  $url = get_site_url();

  wp_enqueue_script('jquery');
  wp_enqueue_script('mrmoneyapp1', $pluginpath . 'build/js/app.js', array('jquery'));
  wp_enqueue_script('mrmoneyapp2', $pluginpath . 'build/js/nouislider.min.js', array('jquery'));
  wp_enqueue_script('mrmoneyapp3', $pluginpath . 'build/js/jquery.colorbox-min.js', array('jquery'));
  wp_enqueue_script('mrmoneyapp4', $pluginpath . 'build/js/jquery.qtip.min.js', array('jquery'));
  wp_enqueue_style("mrmoneystyle1", $pluginpath . 'build/css/style.css');
  wp_enqueue_style("mrmoneystyle2", $pluginpath . 'build/css/nouislider.css');
  wp_enqueue_style("mrmoneystyle2", $pluginpath . 'build/css/jquery.qtip.min.css');

  echo "<script>
        window.mrmoney = {
          path: '{$pluginpath}',
          compare: '{$compare}',
          checkout: '{$checkout}',
          url: '{$url}'
        }
        </script>
        <div id='mrmoney-form' data-type='{$a["type"]}'></div>";
}

function add_checkout()
{
  require_once("php/steuerung.php");
}

add_shortcode('mrmoneyform', 'add_form');
add_shortcode('mrmoneycheckout', 'add_checkout');
add_action('tf_create_options', 'mrmoney_create_options');

?>