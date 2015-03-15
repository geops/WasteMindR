<?php
/**
 * @file
 * Implementation of OpenLayers behavior.
 */

/**
 * Ctools plugin definition.
 */
function entsorgung_openlayers_behavior_entsorgung_click_openlayers_behaviors() {
  return array(
    'title' => t('Entsorgung Map Click Behaviour'),
    'description' => t('Implements a map click behavior which fires map click events in the same way as the themes location box'),
    'type' => 'layer',
    'behavior' => array(
      'file' => 'openlayers_behavior_entsorgung_click.inc',
      'class' => 'openlayers_behavior_entsorgung_click',
      'parent' => 'openlayers_behavior',
    ),
  );
}

/**
 * 
 */
class openlayers_behavior_entsorgung_click extends openlayers_behavior {

  /**
   * Provide initial values for options.
   */
  function options_init() {
    return array();
  }

  /**
   * Form defintion for per map customizations.
   */
  function options_form($defaults = array()) {
    return array();
  }

  /**
   * Render the behavior
   */
  function render(&$map) {
    drupal_add_js(drupal_get_path('module', 'entsorgung') .
      '/plugins/openlayers/behaviors/openlayers_behavior_entsorgung_click.js');
    return $this->options;
  }
}