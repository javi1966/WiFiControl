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
        this.bindEvents();

        console.log("initialize: ");
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
        btnValorPanel.ontouchstart = app.dame_valor;
        btnCerrar.ontouchstart = app.cerrar;
        btnAbout.onclick = app.about;
        console.log("bindEvents:");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {


        app.receivedEvent('deviceready');
        $(document).bind("resume", app.onResumedApp);
        $(document).bind("offline", app.onLineWiFi);
        $(document).bind("panelbeforeopen", "#resulPanel", app.onPanelResul)
        console.log("onDeviceReady");
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        toast("Iniciando...");

        if (!window.navigator.onLine) {


            navigator.notification.confirm(
                    'Wifi no Encendido',
                    app.onWifiOn,
                    'Confirma Wifi',
                    ['OK']
                    );




        }

        console.log('Received Event: ' + id);
    },
    onWifiOn: function (buttonIndex) {
        if (buttonIndex === 1) {
            navigator.app.exitApp();
            console.log("onWifiOn");
        }
    },
    onPageShow: function () {
        /*
         $("#divDesc").hide();
         $("#conectado").hide();
         $("#p_hora_alarma").hide();*/
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
    onConfirmExit: function (buttonIndex) {
        if (buttonIndex === 1) {

            navigator.app.exitApp();
            console.log("onConfirmExit");
        }

    }
    ,
    about: function () {
        $('#popupAbout').popup('open');
        console.log("about");
    }
    ,
    onResumedApp: function () {

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
        var valHttp = ["http://192.168.4.1/MonitorEnergia/voltaje.json",
            "http://192.168.4.1/MonitorEnergia/corriente.json"]

        var id = $(this).attr('id');



        //toast("Obteniendo valores");

        switch (id) {
            case "btnValorTension":

                $.getJSON(valHttp[0], function (vj) {
                    $("#valor").html("Tension: " + vj.Tension.Valor);

                    if (vj.Tension.status === "OK")
                        $("#valor").css({"background-color": "#cc0"});
                    else if (vj.Tension.status === "NOK")
                        $("#valor").css({"background-color": "red"})

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
                    $("#valor").html("Corriente: " + vj.Corriente.Valor);

                    if (vj.Corriente.status === "OK")
                        $("#valor").css({"background-color": "#cc0"});
                    else if (vj.Corriente.status === "NOK")
                        $("#valor").css({"background-color": "red"})



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
        var buf = "";
        buf = "<p>Hola</p>";

        $("p.medida", panel).html("<i>Midiendo - espere...!</i>");


        $.getJSON("http://192.168.4.1/MonitorEnergia/voltaje.json"
            , function (vj) {
            $("p.medida", panel).html("Corriente: " + vj.Corriente.Valor);

            if (vj.Corriente.status === "OK")
                 $("p.medida", panel).css({"background-color": "#cc0"});
            else if (vj.Corriente.status === "NOK")
                 $("p.medida", panel).css({"background-color": "red"})

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


        //$("p.medida", panel).append(buf);
        $(panel).trigger("updatelayout");
        console.log("onPanelResul");
    }


};//fin app
