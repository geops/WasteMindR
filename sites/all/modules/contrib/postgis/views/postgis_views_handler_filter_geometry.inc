<?php

/**
 * @file
 * Definition of postgis_views_handler_filter_geometry.
 */

/**
 * A handler to provide filter for geospatial data.
 */
class postgis_views_handler_filter_geometry extends views_handler_filter {

  var $no_operator = TRUE;

  var $operations = array('ST_Contains', 'ST_Intersects', 'ST_Disjoint');

  function option_definition() {

    $options = parent::option_definition();
    $options['operation'] = array('default' => 'ST_Contains');
    $options['origin'] = array('default' => 'nid_arg');
    $options['value'] = array(
      'default' => array(
        'nid_arg' => '',
        'nid_postgis_field' => '',
      ),
    );

    return $options;
  }

  function value_form(&$form, &$form_state) {
    $form['value']['wkt'] = array(
      '#type' => 'textfield',
      '#title' => t('WKT'),
      '#default_value' => $this->value['wkt'],
      '#weight' => 6,
    );
  }

  function query() {

    $this->ensure_my_table();

    //dpm($this);

    $parent = $this->relationship ? $this->relationship : 'node';

    $where = "$parent.nid = (select entity_id from (select entity_id, st_distance($this->field, st_setsrid(st_geomfromtext(:wkt), 4326)) from $this->table order by 2 limit 1) foo )";


    $this->query->add_where_expression($this->options['group'], $where, array(':wkt' => $this->value['wkt']));
  }
}
