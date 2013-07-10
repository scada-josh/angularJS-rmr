<?php
header('Content-Type: text/html; charset=utf-8');

function escapeJsonString($value) { # list from www.json.org: (\b backspace, \f formfeed)
    $escapers = array("\\", "/", "\"", "\n", "\r", "\t", "\x08", "\x0c");
    $replacements = array("\\\\", "\\/", "\\\"", "\\n", "\\r", "\\t", "\\f", "\\b");
    $result = str_replace($escapers, $replacements, $value);
    
    return $result;
}

# Connect to PostgreSQL database
$conn = pg_connect("dbname='geo_executive_db' user='postgres' password='1234' host='localhost'");
if (!$conn) {
    echo "Not connected : " . pg_error();
    exit;
}

# Build SQL SELECT statement and return the geometry as a GeoJSON element in EPSG: 4326
$sql = "SELECT id, name, st_asgeojson(my_polygons) AS geojson FROM my_geometries";

//job_request.php?bbox=93.097343187494,12.02505009056,107.95085881251,15.662393009138
/*$bbox = $_GET["bbox"];
$bbox_ary = explode(',', $bbox);
$bbox_x1 = $bbox_ary[0];
$bbox_y1 = $bbox_ary[1];
$bbox_x2 = $bbox_ary[2];
$bbox_y2 = $bbox_ary[3];
$sql .= " WHERE r_geom && ST_MakeEnvelope($bbox_x1, $bbox_y1, $bbox_x2, $bbox_y2, 4326)"; //BBOX Strategy*/

# Try query or error
$rs = pg_query($conn, $sql);
if (!$rs) {
    echo "An SQL error occured.\n";
    exit;
}

# Build GeoJSON
$output = '';
$rowOutput = '';

while ($row = pg_fetch_assoc($rs)) {
    $rowOutput = (strlen($rowOutput) > 0 ? ',' : '') . '{"type": "Feature", "geometry": ' . $row['geojson'] . ', "properties": {';
    $props = '';
    $id = '';
    foreach ($row as $key => $val) {
        if ($key != "geojson") {
            $props .= (strlen($props) > 0 ? ',' : '') . '"' . $key . '":"' . escapeJsonString($val) . '"';
        }
        if ($key == "id") { //Defaults = id
            $id .= ',"id":"' . escapeJsonString($val) . '"';
        }
    }

    $rowOutput .= $props . '}';
    $rowOutput .= $id;
    $rowOutput .= '}';
    $output .= $rowOutput;
}

$output = '{ "type": "FeatureCollection", "features": [ ' . $output . ' ]}';
echo $output;
?>