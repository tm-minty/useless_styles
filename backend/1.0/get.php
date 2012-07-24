<?php

function selectors_query( $selectors, $flag ){
    $selectors_query_values = array();
    $flags_query_values = array();
    foreach( $selectors as $selector ){
        $selector['selector'] = mysql_real_escape_string( $selector['selector'] );
        $selector['css'] = mysql_real_escape_string( $selector['css'] );

        $selectors_query_values[] = '("'. $selector['selector'] .'",
                              "'. $selector['css'] .'",
                              "'. md5( $selector['selector'] . $selector['css'] ) .'")';
        $flags_query_values[] = '("'. md5( $selector['selector'] . $selector['css'] ) .'",
                                  "'. ($flag ? 1 : 0) .'",
                                  NOW())';
    }
    $selectors_query = 'INSERT INTO useless_styles_selectors (selector, file, selector_hash) VALUES ' . implode(", ", $selectors_query_values) .'
        ON DUPLICATE KEY UPDATE `file` = file';
    $flags_query = 'INSERT INTO useless_styles_flags (selector_hash, flag, add_date) VALUES ' . implode(", ", $flags_query_values) .'
        ON DUPLICATE KEY UPDATE `flag` = IF(flag = 1, 1, IF(flag = 0 AND VALUES(flag) = 1, 1, 0))';

    return array($selectors_query, $flags_query);
}

$db = mysql_connect('dev2.local', 'css', 'css');
mysql_select_db('css');

$query = '';

$action = $_POST['action'];
if( $action == 'error' ){
    mysql_query('INSERT INTO useless_styles_errors
        (element, url, add_date, error_hash) VALUES
        (
            "'. mysql_real_escape_string( $_POST['element'] ) .'",
            "'. mysql_real_escape_string( $_POST['url'] ) .'",
            NOW(),
            "'. md5(mysql_real_escape_string( $_POST['element'] ).mysql_real_escape_string( $_POST['url'] ).date('dmY', time())) .'"
        );');
}elseif( $action == 'selectors' ){
    $used_query = selectors_query($_POST['used_selectors'], 1);
    mysql_query($used_query[0]);
    mysql_query($used_query[1]);
    $useless_query = selectors_query($_POST['useless_selectors'], 0);
    mysql_query($useless_query[0]);
    mysql_query($useless_query[1]);
}else{
?>
<!DOCTYPE HTML>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title></title>
    <style type="text/css">
        @keyframes wave{
            from { background-position: 0 0; }
            to { background-position: 50% 0; }
        }
        @-moz-keyframes wave{
            from { background-position: 0 0; }
            to { background-position: 50% 0; }
        }
        @-webkit-keyframes wave{
            from { background-position: 0 0; }
            to { background-position: 50% 0; }
        }
        body{padding: 0; background: #FFF url('wave.jpg'); height: 100%; animation: wave 5s infinite; -moz-animation: wave 5s infinite; -webkit-animation: wave 5s infinite; animation-direction: alternate; -moz-animation-direction: alternate; -webkit-animation-direction: alternate;}
        h1{color: #00AAFF; font-size: 26px; font-family: Georgia, "Times New Roman", Times, sans; padding: 50px;}
    </style>
</head>
<body>
    <h1>я волна, новая волна</h1>
</body>
</html>
<? } ?>
