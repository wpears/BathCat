/*
 COPYRIGHT 2009 ESRI

 TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
 Unpublished material - all rights reserved under the
 Copyright Laws of the United States and applicable international
 laws, treaties, and conventions.

 For additional information, contact:
 Environmental Systems Research Institute, Inc.
 Attn: Contracts and Legal Services Department
 380 New York Street
 Redlands, California, 92373
 USA

 email: contracts@esri.com
 */
//>>built
define("esri/nls/lt/jsapi",({io:{proxyNotSet:"Nenustatytas esri.config.defaults.io.proxyUrl."},map:{deprecateReorderLayerString:"Map.reorderLayer(/*String*/ id, /*Number*/ index) nebenaudotinas. Naudokite Map.reorderLayer(/*Layer*/ layer, /*Number*/ index).",deprecateShiftDblClickZoom:"Map.(enable/disable)ShiftDoubleClickZoom nebenaudotinas. Didinimas naudojant Shift ir dvikartį spustelėjimą nebebus palaikomas."},geometry:{deprecateToScreenPoint:"esri.geometry.toScreenPoint nebenaudotinas. Naudokite esri.geometry.toScreenGeometry.",deprecateToMapPoint:"esri.geometry.toMapPoint nebenaudotinas. Naudokite esri.geometry.toMapGeometry."},layers:{tiled:{tileError:"Nepavyko įkelti išklotinės"},dynamic:{imageError:"Vaizdo įkelti nepavyko"},graphics:{drawingError:"Nepavyko atvaizduoti grafinių elementų "},agstiled:{deprecateRoundrobin:"Konstruktoriaus parametras 'roundrobin' nebenaudotinas. Naudokite parametrą 'tileServers'."},imageParameters:{deprecateBBox:"Savybė 'bbox' nebenaudotina. Naudokite parametrą 'extent'."},FeatureLayer:{noOIDField:"objectIdField nenustatytas [url: ${url}]",fieldNotFound:"laukas '${field}' nerastas sluoksnio 'fields' sąraše [url: ${url}]",noGeometryField:"nerastas 'esriFieldTypeGeometry' tipo laukas sluoksnio 'fields' sąraše. Jei naudojamas žemėlapio paslaugos  sluoksnis, elementai neturės geometrijos [url: ${url}]",invalidParams:"užklausoje yra vienas ar daugiau nepalaikomi parametrai",updateError:"atnaujinant sluoksnį įvyko klaida",createUserSeconds:"Sukūrė ${userId} prieš keletą sekundžių",createUserMinute:"Sukūrė ${userId} prieš minutę",editUserSeconds:"Redagavo ${userId} prieš keletą sekundžių",editUserMinute:"Redagavo ${userId} prieš minutę",createSeconds:"Sukurta prieš keletą sekundžių",createMinute:"Sukurta prieš minutę",editSeconds:"Redaguota prieš keletą sekundžių",editMinute:"Redaguota prieš minutę",createUserMinutes:"Sukūrė ${userId} prieš ${minutes} min.",createUserHour:"Sukūrė ${userId} prieš valandą",createUserHours:"Sukūrė ${userId} prieš ${hours} val.",createUserWeekDay:"Sukūrė ${userId}. Sukūrimo data ir laikas: ${weekDay}, ${formattedTime}",createUserFull:"Sukūrė ${userId}. Sukūrimo data ir laikas: ${formattedDate} ${formattedTime}",editUserMinutes:"Redagavo ${userId} prieš ${minutes} min.",editUserHour:"Redagavo ${userId} prieš valandą",editUserHours:"Redagavo ${userId} prieš ${hours} val.",editUserWeekDay:"Redagavo ${userId}. Keitimo data ir laikas ${weekDay} ${formattedTime}",editUserFull:"Redagavo ${userId}. Keitimo data ir laikas ${formattedDate} ${formattedTime}",createUser:"Sukūrė ${userId}",editUser:"Redagavo ${userId}",createMinutes:"Sukurta prieš ${minutes} min.",createHour:"Sukurta prieš valandą",createHours:"Sukurta prieš ${hours} val.",createWeekDay:"Sukurta ${weekDay} ${formattedTime}",createFull:"Sukurta ${formattedDate} ${formattedTime}",editMinutes:"Redaguota prieš ${minutes} min.",editHour:"Redaguota prieš valandą",editHours:"Redaguota prieš ${hours} val.",editWeekDay:"Redaguota ${weekDay} ${formattedTime}",editFull:"Redaguota ${formattedDate} ${formattedTime}"}},tasks:{gp:{gpDataTypeNotHandled:"Nepalaikomas GP duomenų tipas."},na:{route:{routeNameNotSpecified:"Bent vienai stotelei stotelių elementu rinkinyje nenurodytas 'RouteName'."}},query:{invalid:"Užklausos atlikti nepavyko. Patikrinkite parametrus."}},toolbars:{draw:{convertAntiClockwisePolygon:"Poligonams, kurių taškų seka suformuota prieš laikrodžio rodyklę, ji bus apsukta pagal laikrodžio rodyklę.",addPoint:"Spustelkite taškui pridėti",addShape:"Paspauskite figūrai pridėti, arba paspaudę pradėkite ir pabaikite atleidę",addMultipoint:"Spustelkite vedinėti taškams",freehand:"Paspauskite pradėti ir atleiskite pabaigti",start:"Spustelkite pradėti piešimą",resume:"Spustelkite piešimui tęsti",complete:"Dvikarčiu spustelėjimu baikite",finish:"Dvikarčiu spustelėjimu pabaikite",invalidType:"Nepalaikomas geometrijos tipas"},edit:{invalidType:"Įrankio aktyvuoti nepavyko. Patikrinkite, ar šis įėankis tinkamas šiam geometrijos tipui.",deleteLabel:"Šalinti"}},virtualearth:{vetiledlayer:{bingMapsKeyNotSpecified:"Turi būti nustatytas BingMapsKey raktas."},vegeocode:{bingMapsKeyNotSpecified:"Turi būti nustatytas BingMapsKey raktas.",requestQueued:"Nepavyko nuskaityti serverio prieigos rakto. Užklausa stovinti eilėje bus apdorota gavus serverio prieigos raktą."}},widgets:{attributeInspector:{NLS_first:"Pirmas",NLS_previous:"Ankstesnis",NLS_next:"Kitas",NLS_last:"Paskutinis",NLS_deleteFeature:"Šalinti",NLS_title:"Redaguoti atributus",NLS_errorInvalid:"Neteisingas",NLS_validationInt:"Reikšmė turi būti sveikas skaičius.",NLS_validationFlt:"Reikšmė turi būti slankiojo kablelio skaičius.",NLS_of:"iš",NLS_noFeaturesSelected:"Pažymėtų objektų nėra"},overviewMap:{NLS_drag:"Tempdami pakeiskite žemėlapio aprėptį",NLS_show:"Rodyti apžvalgos žemėlapį",NLS_hide:"Slėpti apžvalgos žemėlapį",NLS_maximize:"Išskleisti langą",NLS_restore:"Atkurti",NLS_noMap:"Tarp įvesties parametrų nėra 'map'",NLS_noLayer:"pagrindinis žemėlapis neturi pagrindo sluoksnio",NLS_invalidSR:"sluoksnio koordinačių sistema nesuderinama su pagrindinio žemėlapio koordinačių sistema",NLS_invalidType:"nepalaikomas sluoksnio tipas. Palaikomi tipai yra 'TiledMapServiceLayer' ir 'DynamicMapServiceLayer'"},timeSlider:{NLS_first:"Pirmas",NLS_previous:"Ankstesnis",NLS_next:"Kitas",NLS_play:"Paleisti/Pristabdyti",NLS_invalidTimeExtent:"TimeExtent intervalas nenustatytas arba netinkamo formato."},attachmentEditor:{NLS_attachments:"Priedai:",NLS_add:"Pridėti",NLS_none:"Nė vienas",NLS_error:"Įvyko klaida.",NLS_fileNotSupported:"Šis failo tipas nepalaikomas."},editor:{tools:{NLS_attributesLbl:"Atributai",NLS_cutLbl:"Kirpti",NLS_deleteLbl:"Šalinti",NLS_extentLbl:"Aprėptis",NLS_freehandPolygonLbl:"Laisvai piešiamas poligonas",NLS_freehandPolylineLbl:"Laisvai piešiama linija",NLS_pointLbl:"Taškas",NLS_polygonLbl:"Poligonas",NLS_polylineLbl:"Linija",NLS_reshapeLbl:"Performuoti",NLS_selectionNewLbl:"Nauja atranka",NLS_selectionAddLbl:"Pridėti prie atrankos",NLS_selectionClearLbl:"Naikinti atranką",NLS_selectionRemoveLbl:"Atimti iš atrankos",NLS_selectionUnionLbl:"Sąjunga",NLS_autoCompleteLbl:"Užbaigti automatiškai",NLS_unionLbl:"Sąjunga",NLS_rectangleLbl:"Stačiakampis",NLS_circleLbl:"Apskritimas",NLS_ellipseLbl:"Elipsė",NLS_triangleLbl:"Trikampis",NLS_arrowLbl:"Rodyklė",NLS_arrowLeftLbl:"Rodyklė kairėn",NLS_arrowUpLbl:"Rodyklė į viršun",NLS_arrowDownLbl:"Rodyklė žemyn",NLS_arrowRightLbl:"Rodyklė dešinėn",NLS_undoLbl:"Atšaukti",NLS_redoLbl:"Grąžinti"}},Geocoder:{main:{clearButtonTitle:"Išvalyti paiešką",searchButtonTitle:"Ieškoti",geocoderMenuButtonTitle:"Pakeisti geokoderį",geocoderMenuHeader:"Parinkti geokoderį",geocoderMenuCloseTitle:"Uždaryti meniu",untitledGeocoder:"Bevardis geokoderis"},esriGeocoderName:"Esri pasaulio geokoderis"},legend:{NLS_creatingLegend:"Kuriama legenda",NLS_noLegend:"Legendos nėra"},popup:{NLS_moreInfo:"Daugiau",NLS_searching:"Ieškoma",NLS_prevFeature:"Ankstesnis elementas",NLS_nextFeature:"Kitas elementas",NLS_close:"Užverti",NLS_prevMedia:"Ankstesnė laikmena",NLS_nextMedia:"Kita laikmena",NLS_noInfo:"Nėra duomenų",NLS_noAttach:"Priedų nėra",NLS_maximize:"Išskleisti langą",NLS_restore:"Atkurti",NLS_zoomTo:"Didinti į",NLS_pagingInfo:"(${index} iš ${total})",NLS_attach:"Priedai"},measurement:{NLS_distance:"Atstumas",NLS_area:"Plotas",NLS_location:"Vieta",NLS_resultLabel:"Matavimo rezultatas",NLS_length_miles:"Mylios",NLS_length_kilometers:"Kilometrai",NLS_length_feet:"Pėdos",NLS_length_meters:"Metrai",NLS_length_yards:"Jardai",NLS_area_acres:"Akrai",NLS_area_sq_miles:"Kv. mylios",NLS_area_sq_kilometers:"Kv. kilometrai",NLS_area_hectares:"Hektarai",NLS_area_sq_yards:"Kv. jardai",NLS_area_sq_feet:"Kv. pėdos",NLS_area_sq_meters:"Kv. metrai",NLS_deg_min_sec:"Laipsniai, Minutės, Sekundės",NLS_decimal_degrees:"Laipsniai",NLS_map_coordinate:"Žemėlapio koordinatė",NLS_longitude:"Ilguma",NLS_latitude:"Platuma"},bookmarks:{NLS_add_bookmark:"Pridėti adresyno žymę",NLS_new_bookmark:"Bevardė",NLS_bookmark_edit:"Redaguoti",NLS_bookmark_remove:"Pašalinti"},print:{NLS_print:"Spausdinti",NLS_printing:"Spausdinama",NLS_printout:"Spaudinys"},templatePicker:{creationDisabled:"Elementus kūrimo galimybė išjungta visiems sluoksniams.",loading:"Įkeliama.."}},arcgis:{utils:{baseLayerError:"Pagrindo sluoksnio įkelti nepavyko",geometryServiceError:"Norėdami atverti interneto žemėlapį, nurodykite geometrijos paslaugą."}},identity:{lblItem:"elementas",title:"Prisijungti",info:"Prisijunkite, kad gauti prieeigą prie šio elemento serveryje ${server} ${resource}",lblUser:"Paskyros vardas:",lblPwd:"Slaptažodis:",lblOk:"Gerai",lblSigning:"Jungiamasi...",lblCancel:"Atsisakyti",errorMsg:"Netinkamas paskyros vardas arba slaptažodis. Pabandykite iš naujo.",invalidUser:"Įvestas neteisingas paskyros vardas arba slaptažodis.",forbidden:"Paskyros vardas ir slaptažodis yra teisingi, tačiau Jūs neturite teisių naudotis šiuo resursu.",noAuthService:"Autentifikacijos paslauga nepasiekiama."}}));