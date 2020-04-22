<?php
    $base = "https://pokeapi.co/api/v2/pokemon/";
    $pokemons = array();
    $id_temp = 120;
    $cont = 0;

    // $ch = curl_init();

    // curl_setopt($ch, CURLOPT_URL, "https://pokeapi.co/api/v2/pokemon/1");
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // $resposta = curl_exec($ch);
    // curl_close($ch);


    echo "Salvando arquivos da pokeapi.co no array"."<br>";
    for($id = 211; $id <= 220; $id++ ) {
        // $data = file_get_contents($base.$id);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $base.$id);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $data = curl_exec($ch);
        curl_close($ch);
        array_push($pokemons, json_decode($data));

    }
    // echo "<pre>";
    // var_dump($pokemons);exit;
    echo "Salvando no servidor local"."<br>";

    for ($i=0; $i < count($pokemons) ; $i++) { 
        $pokemons[$i]->sprites->front_default = "assets/images/pokemon/".$pokemons[$i]->id.".png";        
        $pokemons[$i]->sprites->back_default = "assets/images/pokemon/back/".$pokemons[$i]->id.".png";        
        $pokemons[$i]->sprites->back_shiny = "assets/images/pokemon/back/shiny/".$pokemons[$i]->id.".png";        
        $pokemons[$i]->sprites->front_shiny = "assets/images/pokemon/shiny/".$pokemons[$i]->id.".png";
        
        $arquivo = fopen('C:\\xampp\\htdocs\\projetox.pc\\pokedex_servidor\\assets\\arquivos\\'
                                                                                    .$pokemons[$i]->id.'.txt','w+');
        if ($arquivo == false) die('Não foi possível criar o arquivo.');
        fwrite($arquivo, json_encode($pokemons[$i]));
        fclose($arquivo);      

        $arquivo = fopen('C:\\xampp\\htdocs\\projetox.pc\\pokedex_servidor\\assets\\arquivos\\'
                                                                .$pokemons[$i]->name.'.txt','w+');
        if ($arquivo == false) die('Não foi possível criar o arquivo.');
        fwrite($arquivo, json_encode($pokemons[$i]));
        fclose($arquivo);      
    }


    echo "Arquivos estão salvos no servidor";

	//$string = file_get_contents('meuarquivo.txt');
    // $arquivo = fopen('meuarquivo.txt','r');
    // fclose($arquivo);
 
  //  $pokemon = json_decode($string);

  //  $pokemon->sprites->front_default = "assets/images/1.png";
    // print_r('<pre>');
    // print_r($pokemon);exit;
    
    // $arquivo = fopen('meuarquivo.txt','w+');
    // fwrite($arquivo, json_encode($pokemon));

    // fclose($arquivo);

    // echo  $pokemon->name;
    // echo  $pokemon->sprites->front_default;
    // echo '<div class="test"><img src="'.$pokemon->sprites->front_default.'"></div>';
?>