$(function(){


    // Variáveis Globais
    let dataPokemon = null;

    let num_pag_max = 0;
    let pokedexImgs = [];
    let backImgsHighest = [];
    let frontImgsHighest = [];

    //controle paginação da lista de pokemoms
    let pageActual = 1;
    //limit pokemons máximo = 220
    let limitPokemons = 220;
    let limitPage = 10;

    //controle paginação dos movimentos do pokemom
    let pageMovActual = 1;
    let pokemonMovs = [];
    let limitPageMov = 10;

    //define quantidade máxima de páginas
    num_pag_max = Math.ceil(pokedexImgs.length / limitPage);
    
    //define quantidade máxima de páginas do movimentos
    num_pag_max_mov = Math.ceil(pokemonMovs.length / limitPageMov);

//===================================================================================================
    //inicializa a pokedex
    function startPokedex() {

        //cria um array com o elemento img
        // It Creates an array with the element img
        for (var i = 1; i <= limitPokemons; i++) {            
            pokedexImgs.push(`<img class="pokemon" src="assets/images/pokemon/` + i + `.png"/>`);
        }

        // It Initiates the pokedex with the first pokemons
        for (let i = limitPage - 1; i >= 0; i--) {

            $('.box-pok').prepend(`
                <div class="col col-sm-4 pok">
                    ${pokedexImgs[i]}
                </div>              
            `);

        }

        //Add an event click on the  initials images
        pokemonOnClick();

        // Buttons of right side of the display 
        pokedexSideLeft();

        //  It Opens the grafic of status
        openGraficoStatus();

        // It Opens the modalStatus
        pokedexStatus();

        //Search by pokemons
        searchPoke();

        // It Exhibits  the movements of a pokmemon specific 
        showMovs();

        // It Exhibits the six pokemons stronger in attack
        pokedex();

        // show information developer
        infoDeveloper();

        showBox1();
        showBox2();
        showBox3();
        showBox4();

        
        $width = $(window).width();
        // console.log($width);debugger
        sizePage($width);

        pokedexOpen($width);   
        
    }

    window.onresize=function() {
        $width = getDimensions();
        let $display = $('.cover').css('display');
        if($display === 'block'){
            sizePage($width);
        }
        pokedexOpen($width); 
    }

    startPokedex()

    $('.pagination').pajinatify({
        onChange: function (currentPage) {
            let offset = ((currentPage * limitPage) - limitPage);
            let end = offset + limitPage;
            // remove the div with the class pok 
            $('.pok').remove();
            for (let i = offset; i < end; i++) {
    
                $('.box-pok').prepend(`
                    <div class="col col-sm-4 pok">
                        ${pokedexImgs[i]}
                    </div>
                    
                `);
    
            }
            // Adds event of click on the images of the pagination
            pokemonOnClick()         
        },
    });

//===================================================================================================
    //Abre a tampa da pokedex
    function pokedexOpen($width){

        $('#yellowTriangle').on('click', ()=>{
            
            if($width < 575){
                $('.cover').css('transform','rotateX(180deg) translateY(420px)');
                $('#logo').fadeOut(500);
                $('#yellowTriangle').fadeOut(500);
                $('.cover').fadeOut(900,()=>{
                    $('.side-left').fadeIn(1);
                }); 
            }else{
                $('.cover').css('transform','rotateY(180deg) translateX(-300px)');
                $('#logo').fadeOut(500);
                $('#yellowTriangle').fadeOut(500);
                $('.cover').fadeOut(900,()=>{
                    $('.sombra_container').css('box-shadow','-1vh .8vh 0vh 0.4vh rgb(158, 18, 42)');
                    $('.side-right').fadeIn(1);
                });                
            }

            return false;
        });
        // Fecha a tampa da pokedex
        pokedexClose($width); 

    }

    // Fecha a tampa da pokedex
    function pokedexClose($width){

        $('#yellowTriangleR').on('click', ()=>{
            $('.cover').attr('transition-duration','1s');
            $('.cover').show();
            if($width < 575){
                $('.cover').css('transform','rotateX(360deg) translateY(0px)');
                $('.side-left').fadeOut(1);
            }else{
                $('.cover').css('transform','rotateY(360deg) translateX(0px)');
                    $('.side-right').fadeOut(1, ()=>{
                $('.sombra_container').css('box-shadow','-1vh .8vh 0vh 0.8vh rgb(184,184,184)');  
                });
            }
            $('#logo').fadeIn(500);
            $('#yellowTriangle').fadeIn(500);

             
            sizePage($width);
            return false;
        });
        
        
    }

    function sizePage(width){
        
        if(width < 575){
            $('.side-right').fadeIn();
            $('.side-left').css('display', 'none');
        }else{
            $('.side-left').fadeIn();
            $('.side-right').css('display', 'none');
        }
    }

    // ==================================================================================================
    //Pagination return a array with (listItems is called in pokedexAddPok and pokedexAddMov)
    //  listItems return a array with pagination
    /**
     * If the array has a size 30
     * pageActual = 1
     * limitPage = 10
     * O Parametro pagina atual controla a paginação
     * The parameter pageActual control the pagination
     * pageActual return an array with 10 position 0 ---------- 9
     * pageActual = 2
     * pageActual return an array with 10 position10 ---------- 19
     */
    function listItems(items, pageActual, limitItems) {
        let result = [];
        let totalPage = Math.ceil(items.length / limitItems);
        let count = (pageActual * limitItems) - limitItems;
        let delimiter = count + limitItems;

        if (pageActual <= totalPage) {
            for (let i = count; i < delimiter; i++) {
                if (items[i] != null) {
                    result.push(items[i]);
                }
                count++;
            }
        }

        return result;
    };

    //==================================================================================================
    //adds the events of click in the images
    function pokemonOnClick() {
        //class pokemon is added in the tag image on the start of the aplication
        $('.pokemon').on('click', function () {

            var id = $(this).attr('src');
            id = id.split('/pokemon/');
            id = id[1].split('.');
            id = id[0];
            
            $.ajax({
                url: 'assets/arquivos/'+id+'.txt',
                dataType: "text"
              }).then(function(data, status){
                // console.log("teste then ".pokemon);
                
                dataPokemon = JSON.parse(data);
                if (status === "success") {
                    $('.textGreen').css('display','none');
                    $('.pokemonImg').attr('src', dataPokemon.sprites.front_default);
                }
            });
            
        });
    }

    //===================================================================================================
    // Exhibits the pokemon of several shapes and formats
    function pokedexSideLeft(){

        $('#shiny_f').on('click', ()=>{
            if(dataPokemon == null){
                return;
            }
            $('.pokemonImg').attr('src', dataPokemon.sprites.front_shiny); 
        });

        $('#shiny_b').on('click', ()=>{
            if(dataPokemon == null){
                return;
            }
            $('.pokemonImg').attr('src', dataPokemon.sprites.back_shiny); 
        });
     
        $('#front').on('click', ()=>{
            if(dataPokemon == null){
                return;
            }
            $('.pokemonImg').attr('src', dataPokemon.sprites.front_default); 
        });

        $('#back').on('click', ()=>{
            if(dataPokemon == null){
                return;
            }
            $('.pokemonImg').attr('src', dataPokemon.sprites.back_default); 
        });
    }
    //===================================================================================================
    //It opens the modalStatus
    function pokedexStatus(){
        
        $('#one').on('click',()=>{

            // console.log(id);
            // Verifies whether a pokemon was selected
            if(dataPokemon == null){
                // remove o src of the image initial
                $(".pokemonImg").removeAttr("src");
                // Puts a message of warning on the display
                $('.textGreen').css('display','block');
                return;
            }
            
            $('#stats').prepend(`
                <div class="sta_pre">
                <pre>
<strong>name :</strong> <span>${dataPokemon.name}</span> 
<strong>${dataPokemon.stats[1].stat.name} :</strong> <span>${dataPokemon.stats[1].base_stat}</span> <strong>${dataPokemon.stats[2].stat.name} :</strong> <span>${dataPokemon.stats[2].base_stat}</span>  
<strong>${dataPokemon.stats[3].stat.name} :</strong> <span>${dataPokemon.stats[3].base_stat}</span>         <strong>${dataPokemon.stats[4].stat.name} :</strong> <span>${dataPokemon.stats[4].base_stat}</span>        
<strong>${'height'} :</strong> <span>${dataPokemon.height}</span>           <strong>${'weight'} :</strong> <span>${dataPokemon.height}</span>        
<strong>${dataPokemon.stats[0].stat.name} :</strong> <span>${dataPokemon.stats[0].base_stat}</span>            <strong>${dataPokemon.stats[5].stat.name} :</strong> <span>${dataPokemon.stats[5].base_stat}</span> 
<strong>Experience :</strong> <span>${dataPokemon.base_experience}</span>   
                </pre>
                </div>
            `);

            dataPokemon.abilities.forEach(element => {
                $('#skills').append(`
                    <li>${element.ability.name}</li>
                `);                    
            });

            dataPokemon.types.forEach(element => {
                $('#types').append(`
                    <li>${element.type.name}</li>
                `);                    
            });


            $('.description').append(`
                <img class="poke" data-id="front" src="${dataPokemon.sprites.front_default}">
                <img class="poke" data-id="back" src="${dataPokemon.sprites.back_default}">
            `); 
        
            $('#stats').fadeIn(1, ()=>{
                // Transition of the  statistics modal
                $('#stats').attr('transition-duration','2s');
                $('#stats').css('transform','translate(300px, -550px)');                    
            });

            // image front and back
            changeColorImageHover();
            return false;
        });


        //Closes the modal of status 
        closeStatus();
    }

    // image front and back
    function changeColorImageHover(){
        $('.poke').hover(function(){
            id = $(this).attr('data-id');
            if(id === "front"){
                $(this).attr('src',dataPokemon.sprites.front_shiny);
            }else{
                $(this).attr('src',dataPokemon.sprites.back_shiny);
            }
        },function(){
            if(id === "front"){
                $(this).attr('src',dataPokemon.sprites.front_default);
            }else{
                $(this).attr('src',dataPokemon.sprites.back_default);
            }           
        });

    };
    //Closes the modal of status
    function closeStatus(){
        $('#yellowTriangleS').on('click', ()=>{
            $('#stats').fadeOut(1000,()=>{
                $('.sta_pre').empty();
                $('#skills').empty();
                $('#types').empty();
                $('.descript').empty();
                $('.description').empty();                             
            });
        });

        
    }
    //===================================================================================================
    // Search pokemon by name or id 
    function searchPoke(){

        $('#two').on('click', ()=>{

            $('#searchPokeFather').fadeIn(1, ()=>{
                //transition from the search modal
                $('#searchPokeFather').attr('transition-duration','2s');
                $('#searchPokeFather').css('transform','translate(300px, -550px)');
            });
        });
        
        $('#searchButton').on('click', ()=>{
            
            // Cleans the fields to insert the values oh the new search
            $('.imgSearch').empty();
            $('.mainData').empty();

            $('.ablitiesData h6').empty();
            $('.typesData h6').empty();
            $('.ablitiesData ul').empty();
            $('.typesData ul').empty();

            let id = $('#inpSearch').val();
            
            if(id == ""){
                return;
            }
            //Clear the fields of the input
            $('#inpSearch').val("");
            
            $.get(`assets/arquivos/${id}.txt`, function (data, status) {
                
                // console.log(data);
                if(status === 'success'){

                    $('.imgSearch').append(`
                        <div>
                            <img class="poke" data-id="front" src="${data.sprites.front_default}">
                            <img class="poke" src="${data.sprites.back_default}">
                            <span><b>Name:</b> ${data.name}</span>                        
                        </div>
                    `);
                    $('.mainData').append(`
                        <div>
                            <span><b>Height:</b> ${data.height}</span>                      
                            <span><b>Weight:</b> ${data.weight}</span>                       
                            <span><b>Base_experience:</b> ${data.base_experience}</span>                       
                            <span><b>Id:</b> ${data.id}</span>                       
                        </div>
                    `);

                    $('.ablitiesData').prepend(`
                         <h6>Abilities Pokemon</h6>
                     `);

                    data.abilities.forEach(element => {
                        $('.ablitiesData ul').append(`
                            <li>${element.ability.name}</li>
                        `);                        
                    });

                    $('.typesData').prepend(`
                         <h6>Types Pokemon</h6>
                     `);

                    data.types.forEach(element => {
                        $('.typesData ul').append(`
                            <li>${element.type.name}</li>
                        `);                        
                    });

                    $('.status').html(`
                        <h6>STATUS<h6>
                        <b>ATK: </b><span>${data.stats[4].base_stat}</span><br>
                        <b>DEF: </b><span>${data.stats[3].base_stat}</span><br>
                        <b>SPEED: </b><span>${data.stats[0].base_stat}</span><br>
                        <b>HP: </b><span>${data.stats[5].base_stat}</span>
                    `);
                 }
                 turnImageHover(data);
            },'json');
        });

        closeSearchPoke();
    }

    // image front and back
    function turnImageHover(data){
        $('.poke').hover(function(){
            id = $(this).attr('data-id');
            if(id === "front"){
                $(this).attr('src',data.sprites.back_shiny);
            }else{
                $(this).attr('src',data.sprites.front_shiny);
            }
        },function(){
            if(id === "front"){
                $(this).attr('src',data.sprites.front_default);
            }else{
                $(this).attr('src',data.sprites.back_default);
            }           
        });

    };

    function closeSearchPoke(){
        $('#closeSearch').on('click', ()=>{
            $('#searchPokeFather').fadeOut(1000);
        });
    }

    //===================================================================================================
    // Opens a tab with statistics' graph of the pokemon botão 1
    function openGraficoStatus(){
        
        $('#grafico').on('click',()=>{

            if(dataPokemon == null){
                // remove the src of the image initial
                $(".pokemonImg").removeAttr("src");
                // Puts a message of warning on the display
                $('.textGreen').css('display','block');
                return;
            }

            $('#graficoStatsFather').fadeIn(1, ()=>{                   

                //Transition of the modal of graphic
                $('#graficoStatsFather').attr('transition-duration','2s');
                $('#graficoStatsFather').css('transform','translate(300px, -550px)');  
                
                statusGrafico(dataPokemon);
            })
            return false;
        });

        closeGraficoStatus();
    }

    function closeGraficoStatus(){

        $('#yellowTriangleGra').on('click', ()=>{

            var c = document.getElementById("myChart");
            var ctx = c.getContext("2d");

            $('#graficoStatsFather').fadeOut(1000,()=>{
                $('#graficoStats').empty();                          
            });

        });
    }

    function statusGrafico(){

        $("#graficoStats").prepend(`
            <img id="imgStats" src="${dataPokemon.sprites.front_default}"> <span>${dataPokemon.name} </span>
            <canvas id="myChart" width="400" height="400"></canvas>
        `);

        let dados = [];

        dataPokemon.stats.forEach(element => {
            dados.push(element.base_stat);
        });

        var ctx = $("#myChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Speed", "Special_Defense", "Special_Attack", "Defense", "Attack", "Hp"],
                datasets: [{
                    data: dados,
                    backgroundColor: [
                        'rgba(255, 0, 0, 0.5)',
                        'rgba(0, 255, 0, 0.5)',
                        'rgba(0, 0, 0, 0.5)',
                        'rgba(128, 0, 128, 0.5)',
                        'rgba(255, 255, 0, 0.5)',
                        'rgba(0, 0, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(138, 14, 14,1)',
                        'rgba(25, 133, 3, 1)',
                        'rgba(10, 10, 10, 1)',
                        'rgba(88, 31, 88, 1)',
                        'rgba(204, 204, 28, 1)',
                        'rgba(12, 12, 140, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {

                legend: {
                    display: false
                },
                title: {
                    display: false
                },
                scales: {
 
                    xAxes: [{
                        categoryPercentage: 0.5,
                        // barPercentage: 1,  
                        gridLines: {
                            display: false,
                            offsetGridLines: true
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                }
            }
        });
    }

    //===================================================================================================
    // Exhibits the movements of a specific pokemon botão 2
    function showMovs(){

        $('#mov').on('click', ()=>{

            if(dataPokemon == null){
                // remove the src of the image initial
                $(".pokemonImg").removeAttr("src");
                // Puts a message of warning on the display
                $('.textGreen').css('display','block');
                return;
            }
            
            // size of the array of movements
            pokemonMovs = dataPokemon.moves;

            $('#movsFather').fadeIn(1, ()=>{
                //Transition of the  modal of movements 
                $('#movsFather').attr('transition-duration','2s');
                $('#movsFather').css('transform','translate(300px, -550px)');
            });

            $('#movs').prepend(`
                <div class="movsImg">
                    <img id="imgMovs" src="${dataPokemon.sprites.front_default}"> <span>${dataPokemon.name} </span>
                    <h4>Movimentos</h4>            
                </div>

            `); 
        
            //  If the pokemon don't have 10 movements, does that.
            let controle = 10;
            if(dataPokemon.moves.length < 10){
                controle = dataPokemon.moves.length;
            }
            for (let index = 0; index < controle; index++) {
                //first ten movements
                $('#movs > ul').append(`
                    <li>${dataPokemon.moves[index].move.name}</li>
                `);            

            }

            movsControlPage();
            closeShowMovs();
        });

    }

    function closeShowMovs(){
        $('#yellowTriangleM').on('click', ()=>{
            $('#movsFather').fadeOut(1000, ()=>{
                $('#movs .movsImg').empty();
                $('#movs > ul > li').remove();           
            });

        });
    }
    //===================================================================================================
    // Control of the  buttons of the pagination of  the movements
    function movsControlPage(){

        //adicionando evento de click previous da paginação dos movimentos
        // Adding event of click PREVIOUS of pagination of the movements
        $('.pageM-1').on('click', () => {
            controlePaginacaoMov(--pageMovActual);
        });

        //Adding event of click NEXT of pagination of the movements
        $('.pageM-2').on('click', () => {
            controlePaginacaoMov(++pageMovActual);
        });
        
    }

    // Makes a control of  pagination of the movements page  of the pokemon and receives the state actual of the page
    function controlePaginacaoMov(statePage) {

        if (statePage == 0) {
            statePage += 1;
            pageMovActual += 1;
        }

        if (statePage == 1) {
            $('.pageM-1').hide();
        } else {
            $('.pageM-1').show();
        }

        if (statePage == num_pag_max) {
            pageMovActual = num_pag_max;
            $('.pageM-2').hide();
        } else {
            $('.pageM-2').show();
        }

        pokedexAddMovs();

    }

    function pokedexAddMovs() {

        //  listItems return a array with pagination
        /**
         * If the array has a size 30
         * pageActual = 1
         * limitPage = 10
         * O Parametro pagina atual controla a paginação
         * The parameter pageActual control the pagination
         * pageActual return an array with 10 position 0 ---------- 9
         * pageActual = 2
         * pageActual return an array with 10 position10 ---------- 19
         */
        pokemonM = listItems(pokemonMovs, pageMovActual, limitPage);
        // console.log(pokemonM);   
        $('#movs > ul > li').remove();
        for (let i = 0; i <= pokemonM.length - 1; i++) {

            $('#movs > ul').append(`
                <li id="cleanMovs">${pokemonM[i].move.name}</li>
            `);

        }
    }
    //===========================================================================================================
    // Opens the modalPokedex with the list of six pokemons stronger
    function pokedex(){
        
        // id or attack of the pokemon stronger
        let array = highestPokemons();
        // let arrayPokHighest = array[0];
        let arrayIdHighest = array[1];
        let arrayStats = array[2];
    
        $('#pokedexInfo').on('click',()=>{

            $('#modalPokedex').fadeIn(1, ()=>{

                //Transition from pokedex modal
                $('#modalPokedex').attr('transition-duration','2s');
                $('#modalPokedex').css('transform','translate(650px, -100px)');  
                
            });

            addSixHighestPoks(arrayIdHighest);
            somaCharacPoks(arrayIdHighest);
            pokemonHover(arrayStats);

            closeModalPokedex();

            return false;
        });
    }

    // Adding the pokemons in the list of the six stronger on the pokedex modal 
    function addSixHighestPoks(arrayIds){
        let pokedexImgsHighest = [];
        //Adding the pokemons in the list of the six stronger
        // Creates a array with the element img
        for (var i = 0; i < 6; i++) {
            let x = arrayIds[i];
            pokedexImgsHighest.push(`<img class="pokStrongs" id="${i}" src="assets/images/pokemon/` + x + `.png"/>`);
            frontImgsHighest.push(`assets/images/pokemon/` + x + `.png`);
            
            if(x != '798' ){
                backImgsHighest.push(`assets/images/pokemon/back/${x}.png`);
            }else{
                backImgsHighest.push(`assets/images/pokemon/${x}.png`);
            }
        }

        // Initializes the pokedex with the first pokemons
        for (let i = 0; i < 6; i++) {

            $('#boxPokStrongs').prepend(`
                <div class="col col-sm-4 poke">
                    ${pokedexImgsHighest[i]}
                </div>
            `);
        }

        $('#boxPokStrongs').append(`

            <div class="boxPokvalue">
                <strong>Nome: </strong><span></span><br>
                <strong>ATK: </strong><span><span><br>
                <strong>DEF: </strong><span></span><br>
            </div>
        `);
    }

    // Sum of the characteristics of the pokemons
    function somaCharacPoks(arrayIds){
        
        let weight = 0;
        let baseExp = 0;
        let somaStats = 0;

        // Catching the values of the six pokemons stronger
        for (let i = 0; i < arrayIds.length; i++) {
            let x = arrayIds[i];

            $.get(`assets/arquivos/${x}.txt`, function (data, status) {
            
                if(status === "success"){
                    baseExp += data.base_experience;
                    weight += data.weight;
                    data.stats.forEach(element => {
                        somaStats += element.base_stat;
                    });
                }

                $('#totalStats').text(somaStats);
                $("#totalWeight").text(weight);
                $("#totalHeight").text(baseExp);
                
            },"json");
        
        }   
    }

    // Alters the image of front to back in the pokedexInfo modal
    function pokemonHover(arrayStats){

        $('.pokStrongs').hover(function (){

            let $width = $(window).width();
            let pos = $(this).offset();
        
            if($width <= 560){
                // pos = $(this).offset();
                $('.boxPokvalue').css({
                    top: pos.top - 600,
                    left: pos.left + 30,
                    display: 'block'
                });
            }else if($width <= 800){
                // pos = $(this).offset();
                $('.boxPokvalue').css({
                    top: pos.top - 150,
                    left: pos.left - 350,
                    display: 'block'
                });
            }else{
                // console.log("maior: "+$width);
                // pos = $(this).offset();
                $('.boxPokvalue').css({
                    top: pos.top - 150,
                    left: pos.left - 690,
                    display: 'block'
                });
            }

            var id = $(this).attr('id');

            $('.boxPokvalue').html(`
                    <strong>Nome: </strong><span>${arrayStats[id][0]}</span><br>
                    <strong>ATK: </strong><span>${arrayStats[id][2]}</span><br>
                    <strong>DEF: </strong><span>${arrayStats[id][1]}</span><br>
                `);

            
            $(this).attr('src',backImgsHighest[id]);
            $('.boxPokvalue').fadeIn();
        },function(){
            var id = $(this).attr('id');
            $(this).attr('src',frontImgsHighest[id]);
            $('.boxPokvalue').fadeOut();
        });

    }

    function closeModalPokedex(){

        $('#yellowTriangleTotal').on('click', ()=>{
            $('#boxPokStrongs').html("");
            $('#modalPokedex').fadeOut(1000);
        });
    }

    // makes a search in all the pokemons of the pokeapi and return the id and attack of the six stronger
    function highestPokemons(){
        let temp = 0;
        let id = 0;

        let value = 0;
        let minValue = 0;
        let pokArray = [];
        let pokStats = [];
        let pokStatsArray = [];
        let tempId = [];
        let pos = 0;

        //Search all the pokemons of the pokeapi and catch the pokemons, of  attack biggest 
        for (let index = 1; index <= limitPokemons; index++) {

            $.get(`assets/arquivos/${index}.txt`, function (data, status) {
        
                if (status === "success") {

                    //Receives the value of attack of the pokemon
                    temp = data.stats[4].base_stat;
                    id = data.id; 
            
                    if(pokArray.length < 6){
                        pokStats.push(data.name);
                        pokStats.push(data.stats[3].base_stat);
                        pokStats.push(data.stats[4].base_stat);

                        pokStatsArray.push(pokStatsArray);

                        pokStats.pop();pokStats.pop();pokStats.pop();

                        pokArray.push(temp);
                        tempId.push(id);
                    }else{
                            value = data.stats[4].base_stat;
                            //Receives the smallest value of attack of the array
                            minValue = Math.min.apply(null, pokArray);
        
                            if(value > minValue){
                                pokStats.push(data.name);
                                pokStats.push(data.stats[3].base_stat);
                                pokStats.push(data.stats[4].base_stat);
                                pos = pokArray.indexOf(minValue);
                                pokArray[pos] = value;
                                tempId[pos] = id;
                                pokStatsArray[pos] = pokStats;
                                pokStats = [];
                            }
                    }
                    
                };
        
            }, "json");      
        }
 
        return [pokArray, tempId, pokStatsArray];
    }

    // show information developer
    function infoDeveloper(){
        $('#dev').on('click', function(){
            $('#developer').fadeIn(1, ()=>{
                //Transition of the  modal of movements 
                $('#developer').attr('transition-duration','2s');
                $('#developer').css('transform','translate(300px, -550px)');
            });
        });

        closeModalDefault();
    }
    // // show information box 1
    function showBox1(){

        $('#btnBlue1').on('click', function(){
            $('#box1').fadeIn(1, ()=>{
                //Transition of the  modal of movements 
                $('#box1').attr('transition-duration','2s');
                $('#box1').css('transform','translate(300px, -550px)');

            });
            ramdomPokemon();
        });

        closeModalDefault();
    }

    // show information box 2
    function showBox2(){
        $('#btnBlue2').on('click', function(){
            $('#box2').fadeIn(1, ()=>{
                //Transition of the  modal of movements 
                $('#box2').attr('transition-duration','2s');
                $('#box2').css('transform','translate(300px, -550px)');
            });
        });
        
        closeModalDefault();
    }
    // show information box 3
    function showBox3(){
        $('#btnBlue3').on('click', function(){
            $('#box3').fadeIn(1, ()=>{
                //Transition of the  modal of movements 
                $('#box3').attr('transition-duration','2s');
                $('#box3').css('transform','translate(300px, -550px)');
            });
        });

        closeModalDefault();
    }
    // show information box 4
    function showBox4(){
        $('#btnBlue4').on('click', function(){
            $('#box4').fadeIn(1, ()=>{
                //Transition of the  modal of movements 
                $('#box4').attr('transition-duration','2s');
                $('#box4').css('transform','translate(300px, -550px)');
            });
        });

        closeModalDefault();
    }

    function closeModalDefault(){
        $('.yellowTriangleD').on('click', ()=>{
            $('#developer,#box1,#box2,#box3,#box4').fadeOut(1000, ()=>{
          
            });

        });
    }

    function ramdomPokemon(){
        let $pokemon = Math.round(Math.random()*10);
       
        $('.catch').html(`<img src="assets/images/pokemon/${$pokemon}.png">`);
    }
});

window.onresize=function() {
    $width = getDimensions();
}

function getDimensions() {
    largura = window.innerWidth;
    // var altura = window.innerHeight;
    return largura;
}