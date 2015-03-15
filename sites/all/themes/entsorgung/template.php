<?php

/**
 * @file
 * template.php
 */

function entsorgung_preprocess_page(&$vars, $hook) {
    drupal_add_js(drupal_get_path('theme', 'entsorgung') . '/js/jquery.geocomplete.min.js');
    drupal_add_js(drupal_get_path('theme', 'entsorgung') . '/js/entsorgung.js');
}