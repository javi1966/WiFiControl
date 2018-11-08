/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var toast = function (msg) {
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>" + msg + "</h3></div>")
            .css({display: "block",
                opacity: 0.90,
                position: "fixed",
                padding: "7px",
                "text-align": "center",
                width: "270px",
                left: ($(window).width() - 284) / 2,
                top: $(window).height() / 2,
                "-webkit-box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
                "-moz-box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
                "-ms-box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
                "box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)"
            })

            .appendTo("body").delay(3000)
            .fadeOut(400, function () {
                $(this).remove();
            });
};

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

var bRele_1 = false;
var bRele_2 = false;
var bReleSonOff = false;
var bFocoFuente = false;
var bDepuradora = false;

//****************************************************************************


var app = {
    deviceName: "",
    hora: "",
    minu: "",
    hora_alarma: "",
    minuto_alarma: "",
    wifi_conexion: window.navigator.connection || null,
    // Application Constructor
    initialize: function () {

        console.log("initialize: ");

        this.bindEvents();


    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {


        document.addEventListener('deviceready', this.onDeviceReady, false);

        $(document).on('pageshow', '#main', this.onPageShow);
        /* refreshButton.ontouchstart = app.list;
         descButton.ontouchstart = app.disconnect;
         deviceList.ontouchstart = app.connect;
         setHora.ontouchstart = app.ponHora;
         setAlarma.onclick = app.abrePopupAlarma;
         popOK.ontouchstart = app.ponAlarma;*/
        
       
        btnValorTension.ontouchstart = app.dame_valor;
        btnValorCorriente.ontouchstart = app.dame_valor;
        //btnValorCorriente.onclick = app.dame_valor;
        btnValorPanel.ontouchstart = app.dame_valor;
        btnReles.ontouchstart = app.controlReles;
        btnFuArriba.ontouchstart = app.pulso_rele;
        btnFuAbajo.ontouchstart = app.pulso_rele;
        btnFuOFF.ontouchstart = app.pulso_rele;
        btnsonoff.ontouchstart = app.pulso_rele;
        btnFocoFuente.ontouchstart = app.pulso_rele;
        btnDepuradora.ontouchstart = app.pulso_rele;
        btnAbout.onclick = app.about;
        btnMeteo.ontouchstart=app.verClima;
        btnGraf.ontouchstart=app.verGraficas;
        btnGrafPatio.ontouchstart=app.verGraficasPatio;
        btnCerrar.onclick = app.onCerrar;
         
        console.log("bindEvents:");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        console.log("onDeviceReady");

        app.receivedEvent('deviceready');
        $(document).bind("resume", app.onResumedApp);

        $(document).bind("panelbeforeopen", "#relesPanel", app.onRelePanel);
        $(document).bind("panelbeforeopen", "#resulPanel", app.onPanelResul);
        $(document).bind("panelbeforeopen", "#panelClima", app.onResClimaPanel);

    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        toast("Iniciando...");

        $(document).bind("offline", app.onLineWiFi);

        $.ajaxSetup({
            timeout: 20000  //2 segundos

        });
        /*
         if (!window.navigator.onLine) {
         navigator.notification.confirm(
         'Wifi no Encendido',
         app.onWifiOn,
         'Confirma Wifi',
         ['OK']
         );
         }
         
         */

        console.log('Received Event: ' + id);
    },
    onWifiOn: function (buttonIndex) {
        if (buttonIndex === 1) {
            console.log("onWifiOn");
            navigator.app.exitApp();

        }
    },
    onServerOFF: function (buttonIndex) {
        if (buttonIndex === 1) {
            console.log("onServerOFF");


        }
    },
    onPageShow: function () {
        /*
         $("#divDesc").hide();
         $("#conectado").hide();
         $("#p_hora_alarma").hide();*/
        
        console.log(":onPageShow:");
    },
    onConfirmExit: function (buttonIndex) {

        navigator.notification.beep(1);
        if (buttonIndex === 1) {
            console.log("onConfirmExit");
            navigator.app.exitApp();

        }
    },

    onCerrar: function () {

        // navigator.app.exitApp();
        navigator.notification.confirm(
                'Quieres salir de la APP?',
                app.onConfirmExit,
                'Confirma Salida',
                ['OK', 'Cancel']
                );
        console.log("Cerrar");
    },

    about: function () {
        $('#popupAbout').popup('open');
        console.log("about");
    },
     onResumedApp: function () {

        console.log("OnResumedApp");

        if (!window.navigator.onLine) {


            navigator.notification.confirm(
                    'Wifi no Encendido',
                    app.onWifiOn,
                    'Confirma Wifi',
                    ['OK']
                    );
        }

        toast("Salida De Pausa de APP");



    },
    dame_valor: function (e) {
        var valHttp = ["http://192.168.1.50/MonitorEnergia/voltaje.json",
            "http://192.168.1.50/MonitorEnergia/corriente.json"];

        var id = $(this).attr('id');

        //toast("Obteniendo valores");
        navigator.notification.beep(1);
        switch (id) {
            case "btnValorTension": //desde thingspeak

                $.mobile.loading('show', {theme: "a", text: "Conectando", textonly: false});


                $.getJSON('http://api.thingspeak.com/channels/267256/feeds/last.json?api_key=0C2M9I6C2LOH21AI')

                        .done(function (data) {

                            $.mobile.loading("hide");

                            console.log("Tension: " + data.field2);

                            //$(".medida_div").html("Tension:");
                            $(".valor_div").html(data.field2);//.css({"color": "white"});
                            $(".magnitud_div").html("Volt.")
                                    .css({"text-decoration": "none"});

                        })
                        /*
                         $.getJSON(valHttp[0])//, function () {
                         
                         //})
                         .done (function (vj) {
                         $.mobile.loading( "hide");
                         $(".medida_div").html("Tension:");
                         
                         if (vj.Tension.status === "OK")
                         $(".valor_div").html(vj.Tension.Valor).css({"color": "white"});
                         else if (vj.Tension.status === "NOK")
                         $(".valor_div").html(vj.Tension.Valor).css({"color": "red"});
                         
                         $(".magnitud_div").html("volt")
                         .css({"text-decoration":"none"});
                         
                         console.log("ff: " + vj.Tension.Valor);
                         })
                         
                         */
                        .error(function () {
                            
                             $.mobile.loading("hide");
                            navigator.notification.confirm(
                                    'Server OFF',
                                    app.onServerOFF,
                                    'Confirma Wifi',
                                    ['OK']
                                    );
                        });

                break;
            case "btnValorCorriente":  //desde thingspeak

                $.mobile.loading('show', {theme: "a", text: "Conectando", textonly: false});
                
                 $.getJSON('http://api.thingspeak.com/channels/267256/feeds/last.json?api_key=0C2M9I6C2LOH21AI')

                        .done(function (data) {

                            $.mobile.loading("hide");

                            console.log("Corriente: " + data.field1);

                           // $(".medida_div").html("Corriente:");
                            $(".valor_div").html(data.field1).css({"color": "white"});
                            $(".magnitud_div").html("Amp.")
                                    .css({"text-decoration": "none"});

                        })
                
                
                
                
                
                /*
                $.getJSON(valHttp[1])//, function (vj) {

                        .done(function (vj) {

                            $.mobile.loading('hide');

                            $(".medida_div").html("Corriente:");

                            if (vj.Corriente.status === "OK")
                                $(".valor_div").html(vj.Corriente.Valor).css({"color": "white"});

                            else if (vj.Corriente.status === "NOK")
                                $(".valor_div").html(vj.Corriente.Valor).css({"color": "red"});


                            $(".magnitud_div").html("amp")
                                    .css({"text-decoration": "none"});

                            console.log("ff: " + vj.Corriente.Valor);
                        })
                        */ 
                        .error(function () {
                            $.mobile.loading("hide");
                            navigator.notification.confirm(
                                    'Server OFF',
                                    app.onServerOFF,
                                    'Confirma Wifi',
                                    ['OK']
                                    );
                        });

                break;

            case "btnValorPanel":
                $("#resulPanel").panel("open");
                console.log("btnValorPanel");
                break;
            default:
                break;
        }

        /*
         $.ajax({url: val,
         success: function (result) {
         
         
         
         console.log("Resultado: " + result);
         },
         error: function (xhr, status) {
         toast("Error de conexion");
         console.log("Error: " + status + " " + xhr);
         }
         
         });*/
        console.log("dame_valor");

    }
    ,
    controlReles: function () {
        navigator.notification.beep(1);
        $("#relesPanel").panel("open");
        console.log("btnFuente");
    },
    onRelePanel: function (e, ui) {

        console.log("OnRelePanel");
    },
    pulso_rele: function (e) {

        var id = $(this).attr('id');
        navigator.notification.beep(1);

        //toast("Pulsado Rele "+id);

        switch (id) {
            case "btnFuArriba":

                bRele_1 = !bRele_1;
                $.post(bRele_1 ? "http://192.168.1.45/rele1/on/"
                        : "http://192.168.1.45/rele1/off/")
                       .done(function (data) {
                       // function (data,status) {
                            toast("Pulsado: " + data);
                            console.log("Rele 1: " + data);
                        })
                        .fail(function(error) {
                               alert("Error: "+error.responseText);
                         });


                
                break;

            case "btnFuAbajo":

                bRele_2 = !bRele_2;

                $.post(bRele_2 ? "http://192.168.1.45/rele2/on/"
                        : "http://192.168.1.45/rele2/off/")
                        
                        .done(function (data) {
                       // function (data,status) {
                            toast("Pulsado: " + data);
                            console.log("Rele 2: " + data);
                        })
                        .fail(function(error) {
                               alert("Error: "+error.responseText);
                         });

               
                break;

            case "btnFuOFF":

                $.post("http://192.168.1.45/rele1/off/")
                        .done(function (data){
                       // function (data,status) {
                            toast("Fuente OFF");
                            console.log("Fuente Off: " + data);
                        })
                        .fail(function(error) {
                                alert("Error: "+error.responseText);
                         });

                sleep(500);


                $.post("http://192.168.1.45/rele2/off/")
                         .done(function (data){
                       // function (data,status) {
                            //toast("Pulsado: " + data + "\nStatus: " + status);
                            toast("Fuente OFF");
                            console.log("Fuente Off: " + data);
                        })
                        .fail(function(error) {
                                alert("Error: "+error.responseText);
                         });

                
                break;
            case "btnsonoff":

                bReleSonOff = !bReleSonOff;

                $.post(bReleSonOff ? "http://192.168.1.46/rele1/on/"
                        : "http://192.168.1.46/rele1/off/")
                        
                        .done(function (data){
                       // function (data,status) {
                            toast("Pulsado: " + data + "\nStatus: " + status);
                            console.log("Rele SonOff: " + data);
                        })
                        .fail(function(error) {
                                alert("Error: "+error.responseText);
                         });

                console.log("Rele SonOff: " + bReleSonOff);
                break;
            case "btnFocoFuente":

                bFocoFuente = !bFocoFuente;

                $.post(bFocoFuente ? "http://192.168.1.48/rele1/on/"
                        : "http://192.168.1.48/rele1/off/")
                        
                        .done(function (data){
                       // function (data,status) {
                            toast("Pulsado: " + data + "\nStatus: " + status);
                            console.log("Rele Foco Fuente: " + data);
                        })
                        .fail(function(error) {
                                alert("Error: "+error.responseText);
                         });

                console.log("Rele SonOff: " + bFocoFuente);
                break;
                
            case "btnDepuradora":

                bDepuradora = !bDepuradora;

                $.post(bDepuradora ? "http://192.168.1.49/rele1/on/"
                        : "http://192.168.1.49/rele1/off/")
                        
                        .done(function (data){
                       // function (data,status) {
                            toast("Pulsado: " + data + "\nStatus: " + status);
                            console.log("Rele depuradora: " + data);
                        })
                        .fail(function(error) {
                                alert("Error: "+error.responseText);
                         });

                console.log("Rele Depuradora: " + bdepuradora);
                break;    

            default:
                break;
        }


        console.log("Pulsacion Reles");

    },
    onLineWiFi: function () {


        navigator.notification.confirm(
                'Wifi no Encendido',
                app.onWifiOn,
                'Confirma Wifi',
                ['OK']
                );
        console.log("onLineWiFi");
    }
    ,
    onPanelResul: function (e, ui) {

        var panel = this;

        //*******************************
        var gaugeAmp = new Gauge({
            renderTo: 'gaugeAmp',
            //width: 250,
            //height: 250,
            glow: true,
            units: 'Amperios',
            title: false,
            minValue: 0,
            maxValue: 20,
            valueFormat: {int: 2, dec: 2},
            majorTicks: ['0', '4', '8', '12', '16', '20'],
            minorTicks: 2,
            strokeTicks: false,
            highlights: [
                //{from: 0, to: 2, color: 'rgba(0,   255, 0, .15)'},
                {from: 0, to: 4, color: 'rgba(255, 255, 0, .15)'},
                {from: 4, to: 8, color: 'rgba(255, 30,  0, .25)'},
                {from: 8, to: 12, color: 'rgba(255, 0,  225, .25)'},
                {from: 12, to: 16, color: 'rgba(0, 0,  255, .25)'},
                {from: 16, to: 20, color: 'rgba(0, 0,  255, .25)'}
            ],
            colors: {
                plate: '#222',
                majorTicks: '#f5f5f5',
                minorTicks: '#ddd',
                title: '#fff',
                units: '#ccc',
                numbers: '#eee',
                needle: {start: 'rgba(240, 128, 128, 1)', end: 'rgba(255, 160, 122, .9)'}
            }
        });

        //******************************************************
        var gaugeVolt = new Gauge({
            renderTo: 'gaugeVolt',
            // width: 250,
            // height: 250,
            glow: true,
            units: 'Voltios',
            title: false,
            minValue: 0,
            maxValue: 240,
            valueFormat: {int: 3, dec: 0},
            majorTicks: ['0', '20', '40', '60', '80', '100', '120', '140', '160', '180', '200', '220', '240'],
            minorTicks: 2,
            strokeTicks: false,
            highlights: [
                {from: 0, to: 50, color: 'rgba(0,   255, 0, .15)'},
                {from: 50, to: 100, color: 'rgba(255, 255, 0, .15)'},
                {from: 100, to: 150, color: 'rgba(255, 30,  0, .25)'},
                {from: 150, to: 200, color: 'rgba(255, 0,  225, .25)'},
                {from: 200, to: 220, color: 'rgba(0, 0,  255, .25)'},
                {from: 220, to: 240, color: 'rgba(0, 0,  255, .25)'}
            ],
            colors: {
                plate: '#222',
                majorTicks: '#f5f5f5',
                minorTicks: '#ddd',
                title: '#fff',
                units: '#ccc',
                numbers: '#eee',
                needle: {start: 'rgba(240, 128, 128, 1)', end: 'rgba(255, 160, 122, .9)'}
            }
        });
        //***************************************************************************
        $("p.medida", panel).html("<i>Midiendo - espere...!</i>");
        $.mobile.loading('show', {theme: "a", text: "Conectando", textonly: false});
        //$.getJSON("http://192.168.1.50/MonitorEnergia/voltaje.json")
        
        $.getJSON('http://api.thingspeak.com/channels/267256/feeds/last.json?api_key=0C2M9I6C2LOH21AI')
                //, function (vj) {
                .done(function (data) {
                    $.mobile.loading('hide');
                    $("p.medida", panel).html("");
                   // gaugeVolt.setValue(vj.Tension.Valor);
                    gaugeVolt.setValue(data.field2);
                    console.log("Tension: " + data.field2);
                })

                .error(function () {
                     $.mobile.loading("hide");
                      navigator.notification.confirm(
                            'Server OFF',
                            app.onServerOFF,
                            'Confirma Wifi',
                            ['OK']
                            );
                });
        $.mobile.loading('show', {theme: "a", text: "Conectando", textonly: false});
        //$.getJSON("http://192.168.1.50/MonitorEnergia/corriente.json")
        $.getJSON('http://api.thingspeak.com/channels/267256/feeds/last.json?api_key=0C2M9I6C2LOH21AI')
                //, function (vj) {
                .done(function (data) {

                    $.mobile.loading('hide');
                    //gaugeAmp.setValue(vj.Corriente.Valor);
                    gaugeAmp.setValue(data.field1);
                    console.log("Corriente: " + data.field1);
                })

                .error(function () {
                     $.mobile.loading("hide");
                    navigator.notification.confirm(
                            'Server OFF',
                            app.onServerOFF,
                            'Confirma Wifi',
                            ['OK']
                            );
                });


        $(panel).trigger("updatelayout");
        console.log("onPanelResul");
    },
    verClima: function () {
        
      navigator.notification.beep(1);
      $("#panelClima").panel("open");  
        
      console.log("verClima");   
    },
    onResClimaPanel: function (e,ui) {
        
       var panelCli = this; 
        
         //************** Temperatura ******
        var gaugeTemp = new Gauge({
            renderTo: 'gaugeTemp',
            //width: 250,
            //height: 250,
            glow: true,
            units: 'ºC',
            title: false,
            minValue: 0,
            maxValue: 60,
            valueFormat: {int: 2, dec: 1},
            majorTicks: ['0', '10', '20', '30', '40', '50' ,'60'],
            minorTicks: 2,
            strokeTicks: false,
            highlights: [
                //{from: 0, to: 2, color: 'rgba(0,   255, 0, .15)'},
                {from: 0, to: 10, color: 'rgba(0, 0, 255, .15)'},
                {from: 10, to: 20, color: 'rgba(0, 0, 255, .25)'},
                {from: 20, to: 30, color: 'rgba(255, 0,225, .25)'},
                {from: 30, to: 40, color: 'rgba(255, 0,  0, .25)'},
                {from: 40, to: 50, color: 'rgba(255, 0,  0, .25)'},
                {from: 50, to: 60, color: 'rgba(255, 0,  0, .25)'}
            ],
            colors: {
                plate: '#222',
                majorTicks: '#f5f5f5',
                minorTicks: '#ddd',
                title: '#fff',
                units: '#ccc',
                numbers: '#eee',
                needle: {start: 'rgba(240, 128, 128, 1)', end: 'rgba(255, 160, 122, .9)'}
            }
        });
        
        //******************* Humedad ***************************
        
        var gaugeHumedad = new Gauge({
            renderTo: 'gaugeHumedad',
            //width: 250,
            //height: 250,
            glow: true,
            units: '%Hr',
            title: false,
            minValue: 0,
            maxValue: 100,
            valueFormat: {int: 2, dec: 1},
            majorTicks: ['0', '20', '40', '60', '80', '100'],
            minorTicks: 2,
            strokeTicks: false,
            highlights: [
                //{from: 0, to: 2, color: 'rgba(0,   255, 0, .15)'},
                {from: 0, to: 20, color: 'rgba(0, 0, 255, .15)'},
                {from: 20, to: 40, color: 'rgba(255, 30,  0, .25)'},
                {from: 40, to: 60, color: 'rgba(255, 0,  225, .25)'},
                {from: 60, to: 80, color: 'rgba(255, 0,  255, .25)'},
                {from: 80, to: 100, color: 'rgba(255, 0,  255, .25)'}
                
            ],
            colors: {
                plate: '#222',
                majorTicks: '#f5f5f5',
                minorTicks: '#ddd',
                title: '#fff',
                units: '#ccc',
                numbers: '#eee',
                needle: {start: 'rgba(240, 128, 128, 1)', end: 'rgba(255, 160, 122, .9)'}
            }
        });
        
        //******************* Presion Atmosferica ***************************
        
        var gaugePresion = new Gauge({
            renderTo: 'gaugePresion',
            //width: 250,
            //height: 250,
            glow: true,
            units: 'mb',
            title: false,
            minValue: 900,
            maxValue: 1150,
            valueFormat: {int: 4,dec:0},
            majorTicks: ['900', '950', '1000', '1050','1100','1150'],
            minorTicks: 2,
            strokeTicks: false,
            highlights: [
                //{from: 0, to: 2, color: 'rgba(0,   255, 0, .15)'},
                {from: 900, to: 950, color: 'rgba(0, 0,  255, .25)'},
                {from: 950, to: 1000, color: 'rgba(0, 0,  255, .25)'},
                {from: 1000, to: 1050, color: 'rgba(0, 255,  0, .25)'},
                {from: 1050, to: 1100, color: 'rgba(0, 255,  0, .25)'},
                {from: 1100, to: 1150 , color: 'rgba(255, 0,  0, .25)'}
               
                
                
            ],
            colors: {
                plate: '#222',
                majorTicks: '#f5f5f5',
                minorTicks: '#ddd',
                title: '#fff',
                units: '#ccc',
                numbers: '#eee',
                needle: {start: 'rgba(240, 128, 128, 1)', end: 'rgba(255, 160, 122, .9)'}
            }
        });
        
       $("p.medida", panelCli).html("<i>Midiendo - espere...!</i>"); 
        
       $.mobile.loading('show', {theme: "a", text: "Conectando", textonly: false});
      
       $.getJSON('http://api.thingspeak.com/channels/172131/feeds/last.json?api_key=SQ0AWSJRWFJ8Z7O1')
                //, function (vj) {
                .done(function (data) {
                    $.mobile.loading('hide');
                    $("p.medida", panelCli).html("");
                   
                    gaugeTemp.setValue(data.field1);
                    gaugeHumedad.setValue(data.field2);
                    gaugePresion.setValue(data.field3/100);
                    console.log("Temperatura: " + data.field1);
                    console.log("Humedad: " + data.field2);
                    console.log("Presion: " + data.field3);
                })

                .error(function () {
                     $.mobile.loading("hide");
                      navigator.notification.confirm(
                            'Server OFF',
                            app.onServerOFF,
                            'Confirma Wifi',
                            ['OK']
                            );
                });  
        
        
        
      $(panelCli).trigger("updatelayout");  
      console.log("onResClimaPanel");  
    },
    
    
   verGraficas: function () { 
       
        console.log('A pagina Graf.');
        
        $('<iframe>')
               .attr("style","border: 1px solid #cccccc;" )
               .attr("src","https://thingspeak.com/channels/267256/charts/1?api_key=0C2M9I6C2LOH21AI&bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&title=Corriente&type=line" )
               .appendTo("#grafCorriente");
    
       $('<iframe>')
               .attr("style","border: 1px solid #cccccc;" )
               .attr("src","https://thingspeak.com/channels/172131/charts/1?api_key=SQ0AWSJRWFJ8Z7O1&bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=80&title=Temperatura&type=line" )
               .appendTo("#grafTemperatura");
       
        $('<iframe>')
               .attr("style","border: 1px solid #cccccc;" )
               .attr("src","https://thingspeak.com/channels/172131/charts/4?api_key=SQ0AWSJRWFJ8Z7O1&bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&title=Temp. Salon&type=line" )
               .appendTo("#grafTempSalon");
        
        $.mobile.changePage('#graf', 'slide', false, true); 
    
   },
   verGraficasPatio: function (){
       
       console.log('A pagina Graf. Patio');
       
       
       
       
       $('<iframe>')
               .attr("style","border: 1px solid #cccccc;" )
               .attr("src","https://thingspeak.com/channels/338363/charts/1?api_key=F6LVI3CTGDLKJOLM&bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=80&title=Butano&type=line" )
               .appendTo("#grafButano");
    
       $('<iframe>')
               .attr("style","border: 1px solid #cccccc;" )
               .attr("src","https://thingspeak.com/channels/338363/charts/2?api_key=F6LVI3CTGDLKJOLM&bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=80&title=Temperatura&type=line" )
               .appendTo("#grafTemp");
       
       $.mobile.changePage('#graf_patio', 'slide', false, true); 
   }

};//fin app
