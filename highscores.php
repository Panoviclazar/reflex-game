<?php
  error_reporting(E_ALL); 
  ini_set('display_errors', 1);
  
  $player_name = $_POST['player_name'];
  $player_score = (int)$_POST['player_score'];
  
  $player_array = array("name"=>$player_name, "score"=>$player_score);
  
  $highscoreJSON = file_get_contents("scores.json");
  $highscore_array = json_decode($highscoreJSON, true);
  
  $key = 0;
  $highscores = array();
  
  if ($player_score > $highscore_array[2]['score']) {
    foreach($highscore_array as $k => $value) {
      $score = $value['score'];
      
      if ($score >= $player_score) {
        $highscores[$k] = $value;
      }
      
      if ($score < $player_score) {
          $key = $k;
        
          $highscores[$k] = $player_array;
          
          for ($i = $key; $i < 2; $i++) {
            $highscores[$i + 1] = $highscore_array[$i];
          }
          break;
      }
    }
    
    $jsonscores = json_encode($highscores);
    file_put_contents('scores.json', $jsonscores);

    var_dump(file_put_contents('scores.json', $jsonscores));
  }
?>