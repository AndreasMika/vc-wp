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
    'name' => __( 'Angebot Anfordern Page', $themeName),
    'id' => 'angebot_page',
    'type' => 'select-pages',
  ) );

  $panel->createOption( array(
    'name' => __( 'PartnerID', $themeName),
    'id' => 'partner_id',
    'type' => 'text',
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
  $angebot = $titan->getOption("angebot_page");
  $partner_id = $titan->getOption("partner_id");
  $url = get_site_url();

  wp_enqueue_script('jquery');
  wp_enqueue_script('mrmoneyapp1', $pluginpath . 'build/js/app.js', array('jquery'));
  wp_enqueue_script('mrmoneyapp2', $pluginpath . 'build/js/nouislider.min.js', array('jquery'));
  wp_enqueue_script('mrmoneyapp3', $pluginpath . 'build/js/jquery.colorbox-min.js', array('jquery'));
  wp_enqueue_script('mrmoneyapp4', $pluginpath . 'build/js/jquery.qtip.min.js', array('jquery'));


  wp_enqueue_style("mrmoneystyle2", $pluginpath . 'build/css/nouislider.css');
//  wp_enqueue_style("mrmoneystyle3", $pluginpath . 'build/css/jquery.qtip.min.css');
  wp_enqueue_style("mrmoneystyle1", $pluginpath . 'build/css/style.css');

  echo "<script>
        window.mrmoney = {
          path: '{$pluginpath}',
          compare: '{$compare}',
          checkout: '{$checkout}',
          angebot: '{$angebot}',
          partner_id: '{$partner_id}',
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



class WP_Mrmoney_Filters_Widget extends WP_Widget {
  public function __construct() {
    parent::__construct(
        'widget_mrmoney_filters',
        'Mrmoney filters widget',
        array( 'description' => 'Mrmoney filters show', )
    );
  }
  public function update( $new_instance, $old_instance ) {
    $instance = array();
    $instance['title'] = strip_tags( $new_instance['title'] );
    return $instance;
  }
  public function form( $instance ) {
    ?>
    <p>
      <label for="<?php echo $this->get_field_id( 'title' ); ?>">Title</label>
      <input class="widefat" type="text"
          id="<?php echo $this->get_field_id( 'title' ); ?>"
          name="<?php echo $this->get_field_name( 'title' ); ?>"
          value="<?php echo $instance['title']; ?>"
      />
    </p>
    <?php
  }
  public function widget( $args, $instance ) {
    ?>

    <section id="recent-comments-2" class="widget widget_recent_comments">
      <div class="mrmoney-widget-wrapper">
        <?php if ($instance[ 'title' ]) { ?><h2 class="widget-title"><?php echo $instance[ 'title' ]; ?></h2><?php } ?>
        <div class="mrmoney-widget-content"></div>
      </div>
    </section>

    <?php
  }
}
add_action( 'widgets_init', function(){
  register_widget( 'WP_Mrmoney_Filters_Widget' );
});


?>