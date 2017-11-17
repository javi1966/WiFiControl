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
                "box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
            })

            .appendTo("body").delay(3000)
            .fadeOut(400, function () {
                $(this).remove();
            });
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


var bRele_1=false;
var bRele_2=false;

//********************************************************


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
        btnCerrar.onclick = app.cerrar;
        btnValorTension.ontouchstart = app.dame_valor;
        btnValorCorriente.ontouchstart = app.dame_valor;
        //btnValorCorriente.onclick = app.dame_valor;
        btnValorPanel.ontouchstart = app.dame_valor;
        btnFuente.ontouchstart = app.controlFuente;
        btnFuArriba.ontouchstart = app.pulso_rele;
        btnFuAbajo.ontouchstart = app.pulso_rele;
        btnFuOFF.ontouchstart = app.pulso_rele;
        btnAbout.onclick = app.about;
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
        
        $(document).bind("panelbeforeopen", "#resulPanel", app.onPanelResul)
        
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        toast("Iniciando...");
        
        $(document).bind("offline",app.onLineWiFi);
        
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
    onPageShow: function () {
        /*
         $("#divDesc").hide();
         $("#conectado").hide();
         $("#p_hora_alarma").hide();*/
    },
    onConfirmExit: function (buttonIndex) {
        navigator.notification.beep(1);
        if (buttonIndex === 1) {
            console.log("onConfirmExit");
            navigator.app.exitApp();
           
        }
    },
    
    cerrar: function () {

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
    }
    ,
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
            "http://192.168.1.50/MonitorEnergia/corriente.json"]

        var id = $(this).attr('id');
        
        //toast("Obteniendo valores");
         navigator.notification.beep(1);
        switch (id) {
            case "btnValorTension":

                $.getJSON(valHttp[0], function (vj) {
                    
                    $(".medida_div").html("Tension:");
                     
                    if (vj.Tension.status === "OK")
                        $(".valor_div").html(vj.Tension.Valor).css({"color": "white"});
                    else if (vj.Tension.status === "NOK")
                        $(".valor_div").html(vj.Tension.Valor).css({"color": "red"})
                    
                     $(".magnitud_div").html("volt")
                            .css({"text-decoration":"none"});

                    console.log("ff: " + vj.Tension.Valor)

                })
                .error(function () {
                            navigator.notification.confirm(
                                    'AP Hello_IoT no selec.',
                                    app.onWifiOn,
                                    'Confirma Wifi',
                                    ['OK']
                                    );
                        });
                break;
            case "btnValorCorriente":

                $.getJSON(valHttp[1], function (vj) {
                    
                    $(".medida_div").html("Corriente:"); 

                    if (vj.Corriente.status === "OK")
                        $(".valor_div").html(vj.Corriente.Valor).css({"color": "white"});
                            
                    else if (vj.Corriente.status === "NOK")
                        $(".valor_div").html(vj.Corriente.Valor).css({"color": "red"});
                            

                    $(".magnitud_div").html("amp")
                            .css({"text-decoration":"none"});

                    console.log("ff: " + vj.Corriente.Valor)
                })
                .error(function () {

                            navigator.notification.confirm(
                                    'AP Hello_IoT no selec.',
                                    app.onWifiOn,
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
    controlFuente:function () {
                  $("#fuentePanel").panel("open");
                  console.log("btnFuente");
    },
    pulso_rele: function (e) {
      
        var id = $(this).attr('id');
        navigator.notification.beep(1);
       
        //toast("Pulsado Rele "+id);

        switch (id) {
            case "btnFuArriba":
                
                bRele_1=!bRele_1;
                $.post(bRele_1?"http://192.168.1.45/rele1/on/"
                              :"http://192.168.1.45/rele1/off/",
                        function( data ) {
                         toast("Pulsado "+data);
                        });
               
                console.log("Rele 1: "+bRele_1);
                break;
                
            case "btnFuAbajo":
                
                 bRele_2 = !bRele_2;
               
                $.post(bRele_2?"http://192.168.1.45/rele2/on/"
                              :"http://192.168.1.45/rele2/off/",
                        function( data ) {
                         toast("Pulsado "+data);
                        });
               
                console.log("Rele 2: "+bRele_2);
                break;
                
            case "btnFuOFF":
            
                  $.post("http://192.168.1.45/rele1/off/",
                             
                        function( data ) {
                        console.log("Rele 1 OFF ");
                        });
                        
                  sleep(500);
                  
                  
                  $.post("http://192.168.1.45/rele2/off/",
                             
                        function( data ) {
                        console.log("Rele 2 OFF ");
                        });      
               
                toast("Fuente OFF");
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
            majorTicks: ['0', '2', '4', '8', '12', '16', '20'],
            minorTicks: 2,
            strokeTicks: false,
            highlights: [
                {from: 0, to: 2, color: 'rgba(0,   255, 0, .15)'},
                {from: 2, to: 4, color: 'rgba(255, 255, 0, .15)'},
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
       var  gaugeVolt= new Gauge({
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
   //****************************************************
        $("p.medida", panel).html("<i>Midiendo - espere...!</i>");
        
        $.getJSON("http://192.168.1.50/MonitorEnergia/voltaje.json"
                , function (vj) {
                  
                    $("p.medida", panel).html("");
                    gaugeVolt.setValue(vj.Tension.Valor);
                    
                    console.log("ff: " + vj.Tension.Valor)
                })
                .error(function () {

                    navigator.notification.confirm(
                            'AP Hello_IoT no selec.',
                            app.onWifiOn,
                            'Confirma Wifi',
                            ['OK']
                            );
                });

        $.getJSON("http://192.168.1.50/MonitorEnergia/corriente.json"
                , function (vj) {
                  
                    gaugeAmp.setValue(vj.Corriente.Valor);
                    
                    console.log("ff: " + vj.Corriente.Valor)
                })
                .error(function () {

                    navigator.notification.confirm(
                            'AP Hello_IoT no selec.',
                            app.onWifiOn,
                            'Confirma Wifi',
                            ['OK']
                            );
                });

        
        $(panel).trigger("updatelayout");
        console.log("onPanelResul");
    }


};//fin app
