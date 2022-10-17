$(document).ready(function () {
   
    intervall();
    $.ajax({
        url: '/api/Client/GetCompanyid',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('companyid').innerHTML = data.data;
                document.getElementById('companyname1').innerHTML = data.data1;
                document.getElementById('usernam').innerHTML = 'Welcome ' + data.data2;
                document.getElementById('username1').innerHTML = data.data2;


                var companyid = document.getElementById('companyid').innerHTML;
                if (companyid == "1jTUJPLyMq3") {
                    document.getElementById("pnsimage").style.display = "block";
                    document.getElementById("sbsimage").style.display = "none";
                    document.getElementById("imgdiv").style.display = "none";
                }
                else {
                    document.getElementById("sbsimage").style.display = "block";
                    document.getElementById("pnsimage").style.display = "none";
                    document.getElementById("imgdiv").style.display = "none";
                }
                userPr.src = data.data3;
                userPr1.src = data.data3;
                var salescounter = 0;
                var accountscounter = 0;
                var dispatchcounter = 0;
                var DOCounter = 0;
                var purchasecounter = 0;
                $.ajax({
                    url: '/api/UserManagement/fillpermission',
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.data.length > 0) {
                            for (let i = 0; i < data.data.length; i++) {
                                switch (data.data[i].formsName) {
                                    case "ITEM_MASTER":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("items").style.display = "block";
                                                } else {
                                                    document.getElementById("items").style.display = "none";
                                                }
                                                break;
                                            case "CREATE":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("itemscreate").style.display = "block";
                                                } else {
                                                    document.getElementById("itemscreate").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }
                                        break;
                                    case "CUSTOMER_DATA":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("parties").style.display = "block";
                                                } else {
                                                    document.getElementById("parties").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }
                                        break;
                                    case "SALES_QUOTATION":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    salescounter = +salescounter + 1;
                                                    document.getElementById("salesquotationlay").style.display = "block";
                                                } else {
                                                    document.getElementById("salesquotationlay").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }
                                        break;
                                    case "PROFORMA_INVOICE":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    salescounter = +salescounter + 1;
                                                    document.getElementById("proformainvoicelay").style.display = "block";
                                                } else {
                                                    document.getElementById("proformainvoicelay").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }
                                        break;
                                    case "PURCHASE_ORDER":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    salescounter = +salescounter + 1;
                                                    document.getElementById("purchaseorderlay").style.display = "block";
                                                } else {
                                                    document.getElementById("purchaseorderlay").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }
                                        break;
                                    case "DESPATCH_ORDER":
                                        switch (data.data[i].operations) {
                                            case "VIEW":

                                                if (data.data[i].permission == true) {
                                                    dispatchcounter = +dispatchcounter + 1;
                                                    DOCounter = +DOCounter + 1;
                                                    document.getElementById("createDO").style.display = "block";
                                                } else {
                                                    document.getElementById("createDO").style.display = "none";
                                                }
                                                break;
                                            case "CHECKER":
                                                if (data.data[i].permission == true) {
                                                    dispatchcounter = +dispatchcounter + 1;
                                                    DOCounter = +DOCounter + 1;
                                                    document.getElementById("checkDO").style.display = "block";
                                                } else {
                                                    document.getElementById("checkDO").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }
                                        break;
                                    case "DESPATCH_PLANNING":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    dispatchcounter = +dispatchcounter + 1;
                                                    document.getElementById("dispatchedplanning").style.display = "block";
                                                } else {
                                                    document.getElementById("dispatchedplanning").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }
                                        break;
                                    case "PURCHASE_ITEM":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    accountscounter = +accountscounter + 1;
                                                    purchasecounter = +purchasecounter + 1;
                                                    document.getElementById("createPR").style.display = "block";
                                                } else {
                                                    document.getElementById("createPR").style.display = "none";
                                                }
                                                break;
                                            case "CHECKER":
                                                if (data.data[i].permission == true) {
                                                    purchasecounter = +purchasecounter + 1;
                                                    document.getElementById("checkPR").style.display = "block";
                                                } else {
                                                    document.getElementById("checkPR").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }
                                        break;
                                    case "SALE_ORDER":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    accountscounter = +accountscounter + 1;
                                                    document.getElementById("saleorder").style.display = "block";
                                                } else {
                                                    document.getElementById("saleorder").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }
                                        break;
                                    case "VOUCHERS":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("Voucher").style.display = "block";
                                                } else {
                                                    document.getElementById("Voucher").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }

                                        break;
                                    case "SALE":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    accountscounter = +accountscounter + 1;
                                                    document.getElementById("createSale").style.display = "block";
                                                } else {
                                                    document.getElementById("createSale").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }
                                        break;
                                    case "PURCHASE":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("createPurchase").style.display = "block";
                                                } else {
                                                    document.getElementById("createPurchase").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }

                                        break;
                                    case "RECEIPT":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("createReceipt").style.display = "block";
                                                } else {
                                                    document.getElementById("createReceipt").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }

                                        break;
                                    case "PHYSICAL_STOCK":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("viewPhysicalStock").style.display = "block";
                                                } else {
                                                    document.getElementById("viewPhysicalStock").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }

                                        break;
                                    case "DEBIT_NOTE":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("createDebitNote").style.display = "block";
                                                } else {
                                                    document.getElementById("createDebitNote").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }

                                        break;
                                    case "REPORTS":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("reports").style.display = "block";
                                                } else {
                                                    document.getElementById("reports").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }

                                        break;
                                    case "SETTINGS":
                                        switch (data.data[i].operations) {
                                            case "SETTING":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("settingbutton").style.display = "block";
                                                } else {
                                                    document.getElementById("settingbutton").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }

                                        break;
                                    case "GENERAL_ENTRY":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("GeneralEntry").style.display = "block";
                                                } else {
                                                    document.getElementById("GeneralEntry").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }

                                        break;
                                    case "MATERIAL_SHIFTING":
                                        switch (data.data[i].operations) {
                                            case "VIEW":
                                                if (data.data[i].permission == true) {
                                                    document.getElementById("MaterialShifting").style.display = "block";
                                                } else {
                                                    document.getElementById("MaterialShifting").style.display = "none";
                                                }
                                                break;
                                            default:
                                        }

                                        break;
                                }
                            }
                            if (+salescounter > 0) {
                                document.getElementById("salesmarketing").style.display = "block";
                            } else {
                                document.getElementById("salesmarketing").style.display = "none";
                            }
                            if (+dispatchcounter > 0) {
                                document.getElementById("dispachtedlogistics").style.display = "block";
                            } else {
                                document.getElementById("dispachtedlogistics").style.display = "none";
                            }
                            if (+DOCounter > 0) {
                                document.getElementById("dispatchedorder").style.display = "block";
                            } else {
                                document.getElementById("dispatchedorder").style.display = "none";
                            }
                            if (+accountscounter > 0) {
                                document.getElementById("accountfinance").style.display = "block";
                            }
                            else {
                                document.getElementById("accountfinance").style.display = "none";
                            }
                            if (+purchasecounter > 0) {
                                document.getElementById("purchaseItem").style.display = "block";
                            }
                            else {
                                document.getElementById("purchaseItem").style.display = "none";
                            }


                        } else {

                            document.getElementById("parties").style.display = "none";
                            document.getElementById("items").style.display = "none";
                            document.getElementById("salesmarketing").style.display = "none";
                            document.getElementById("accountfinance").style.display = "none";
                            document.getElementById("saleorder").style.display = "none";
                            document.getElementById("purchaseItem").style.display = "none";
                            document.getElementById("createPR").style.display = "none";
                            document.getElementById("checkPR").style.display = "none";
                            document.getElementById("dispachtedlogistics").style.display = "none";
                            document.getElementById("dispatchedplanning").style.display = "none";
                            document.getElementById("dispatchedorder").style.display = "none";
                            document.getElementById("createDO").style.display = "none";
                            document.getElementById("checkDO").style.display = "none";
                            document.getElementById("reports").style.display = "none";

                            // code block
                        }
                    }
                });

            }
            else {
                window.location.href = "../Index";

            }
        }
    })
})
function intervall() {
    setInterval(function () {
        Notifications()
    }, 100);
    setInterval(function () {
        Notificationscounter()
    }, 500);
    setInterval(function () {
        PendingNotifications()
    }, 100000);
    setInterval(function () {
        taskCloseRequestNotifications()
    }, 10000);
}

function companylist() {
    dataTable = $("#companylist").DataTable({
        ajax: {
            'url': '/api/Client/FetchCompanyList',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            {
                'data': 'companyname', 'render': function (data, type, row) {

                    return `<a href="" onclick=redirect("${row.uniquecode}")>${data}</a>`;
                },
                'width': '60%'
            },
            { 'data': 'financialYear', 'defaultContent': '', 'width': '70%' },

        ],

        "paging": false,
        "bDestroy": true,
        "searching": false,
        "ordering": false,
        "info": false,
        "scrollX": false,
        "responsive": true,
        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '30%',
        },
    });
}

function redirect(companyid) {
    $.ajax({
        url: '/api/Client/SaveCompanyid?companyid=' + companyid,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                window.location.href = "../Dashboard";
            }
        }
    });
}
function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res
}
var state_arr = new Array("Andaman & Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli", "Daman & Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Pondicherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "TELANGANA", "Tripura", "Uttar Pradesh", "Uttrakhand", "West Bengal");



var s_a = new Array();
s_a[0] = "";
s_a[1] = " Alipur | Andaman Island | Anderson Island | Arainj-Laka-Punga | Austinabad | Bamboo Flat | Barren Island | Beadonabad | Betapur | Bindraban | Bonington | Brookesabad | Cadell Point | Calicut | Chetamale | Cinque Islands | Defence Island | Digilpur | Dolyganj | Flat Island | Geinyale | Great Coco Island | Haddo | Havelock Island | Henry Lawrence Island | Herbertabad | Hobdaypur | Ilichar | Ingoie | Inteview Island | Jangli Ghat | Jhon Lawrence Island | Karen | Kartara | KYD Islannd | Landfall Island | Little Andmand | Little Coco Island | Long Island | Maimyo | Malappuram | Manglutan | Manpur | Mitha Khari | Neill Island | Nicobar Island | North Brother Island | North Passage Island | North Sentinel Island | Nothen Reef Island | Outram Island | Pahlagaon | Palalankwe | Passage Island | Phaiapong | Phoenix Island | Port Blair | Preparis Island | Protheroepur | Rangachang | Rongat | Rutland Island | Sabari | Saddle Peak | Shadipur | Smith Island | Sound Island | South Sentinel Island | Spike Island | Tarmugli Island | Taylerabad | Titaije | Toibalawe | Tusonabad | West Island | Wimberleyganj | Yadita";
s_a[2] = " Achampet | Adilabad | Adoni | Alampur | Allagadda | Alur | Amalapuram | Amangallu | Anakapalle | Anantapur | Andole | Araku | Armoor | Asifabad | Aswaraopet | Atmakur | B. Kothakota | Badvel | Banaganapalle | Bandar | Bangarupalem | Banswada | Bapatla | Bellampalli | Bhadrachalam | Bhainsa | Bheemunipatnam | Bhimadole | Bhimavaram | Bhongir | Bhooragamphad | Boath | Bobbili | Bodhan | Chandoor | Chavitidibbalu | Chejerla | Chepurupalli | Cherial | Chevella | Chinnor | Chintalapudi | Chintapalle | Chirala | Chittoor | Chodavaram | Cuddapah | Cumbum | Darsi | Devarakonda | Dharmavaram | Dichpalli | Divi | Donakonda | Dronachalam | East Godavari | Eluru | Eturnagaram | Gadwal | Gajapathinagaram | Gajwel | Garladinne | Giddalur | Godavari | Gooty | Gudivada | Gudur | Guntur | Hindupur | Hunsabad | Huzurabad | Huzurnagar | Hyderabad | Ibrahimpatnam | Jaggayyapet | Jagtial | Jammalamadugu | Jangaon | Jangareddygudem | Jannaram | Kadiri | Kaikaluru | Kakinada | Kalwakurthy | Kalyandurg | Kamalapuram | Kamareddy | Kambadur | Kanaganapalle | Kandukuru | Kanigiri | Karimnagar | Kavali | Khammam | Khanapur (AP) | Kodangal | Koduru | Koilkuntla | Kollapur | Kothagudem | Kovvur | Krishna | Krosuru | Kuppam | Kurnool | Lakkireddipalli | Madakasira | Madanapalli | Madhira | Madnur | Mahabubabad | Mahabubnagar | Mahadevapur | Makthal | Mancherial | Mandapeta | Mangalagiri | Manthani | Markapur | Marturu | Medachal | Medak | Medarmetla | Metpalli | Mriyalguda | Mulug | Mylavaram | Nagarkurnool | Nalgonda | Nallacheruvu | Nampalle | Nandigama | Nandikotkur | Nandyal | Narasampet | Narasaraopet | Narayanakhed | Narayanpet | Narsapur | Narsipatnam | Nazvidu | Nelloe | Nellore | Nidamanur | Nirmal | Nizamabad | Nuguru | Ongole | Outsarangapalle | Paderu | Pakala | Palakonda | Paland | Palmaneru | Pamuru | Pargi | Parkal | Parvathipuram | Pathapatnam | Pattikonda | Peapalle | Peddapalli | Peddapuram | Penukonda | Piduguralla | Piler | Pithapuram | Podili | Polavaram | Prakasam | Proddatur | Pulivendla | Punganur | Putturu | Rajahmundri | Rajampeta | Ramachandrapuram | Ramannapet | Rampachodavaram | Rangareddy | Rapur | Rayachoti | Rayadurg | Razole | Repalle | Saluru | Sangareddy | Sathupalli | Sattenapalle | Satyavedu | Shadnagar | Siddavattam | Siddipet | Sileru | Sircilla | Sirpur Kagaznagar | Sodam | Sompeta | Srikakulam | Srikalahasthi | Srisailam | Srungavarapukota | Sudhimalla | Sullarpet | Tadepalligudem | Tadipatri | Tanduru | Tanuku | Tekkali | Tenali | Thungaturthy | Tirivuru | Tirupathi | Tuni | Udaygiri | Ulvapadu | Uravakonda | Utnor | V.R. Puram | Vaimpalli | Vayalpad | Venkatgiri | Venkatgirikota | Vijayawada | Vikrabad | Vinjamuru | Vinukonda | Visakhapatnam | Vizayanagaram | Vizianagaram | Vuyyuru | Wanaparthy | Warangal | Wardhannapet | Yelamanchili | Yelavaram | Yeleswaram | Yellandu | Yellanuru | Yellareddy | Yerragondapalem | Zahirabad ";
s_a[3] = " Along | Anini | Anjaw | Bameng | Basar | Changlang | Chowkhem | Daporizo | Dibang Valley | Dirang | Hayuliang | Huri | Itanagar | Jairampur | Kalaktung | Kameng | Khonsa | Kolaring | Kurung Kumey | Lohit | Lower Dibang Valley | Lower Subansiri | Mariyang | Mechuka | Miao | Nefra | Pakkekesang | Pangin | Papum Pare | Passighat | Roing | Sagalee | Seppa | Siang | Tali | Taliha | Tawang | Tezu | Tirap | Tuting | Upper Siang | Upper Subansiri | Yiang Kiag ";
s_a[4] = " Abhayapuri | Baithalangshu | Barama | Barpeta Road | Bihupuria | Bijni | Bilasipara | Bokajan | Bokakhat | Boko | Bongaigaon | Cachar | Cachar Hills | Darrang | Dhakuakhana | Dhemaji | Dhubri | Dibrugarh | Digboi | Diphu | Goalpara | Gohpur | Golaghat | Guwahati | Hailakandi | Hajo | Halflong | Hojai | Howraghat | Jorhat | Kamrup | Karbi Anglong | Karimganj | Kokarajhar | Kokrajhar | Lakhimpur | Maibong | Majuli | Mangaldoi | Mariani | Marigaon | Moranhat | Morigaon | Nagaon | Nalbari | Rangapara | Sadiya | Sibsagar | Silchar | Sivasagar | Sonitpur | Tarabarihat | Tezpur | Tinsukia | Udalgiri | Udalguri | UdarbondhBarpeta";
s_a[5] = " Adhaura | Amarpur | Araria | Areraj | Arrah | Arwal | Aurangabad | Bagaha | Banka | Banmankhi | Barachakia | Barauni | Barh | Barosi | Begusarai | Benipatti | Benipur | Bettiah | Bhabhua | Bhagalpur | Bhojpur | Bidupur | Biharsharif | Bikram | Bikramganj | Birpur | Buxar | Chakai | Champaran | Chapara | Dalsinghsarai | Danapur | Darbhanga | Daudnagar | Dhaka | Dhamdaha | Dumraon | Ekma | Forbesganj | Gaya | Gogri | Gopalganj | H.Kharagpur | Hajipur | Hathua | Hilsa | Imamganj | Jahanabad | Jainagar | Jamshedpur | Jamui | Jehanabad | Jhajha | Jhanjharpur | Kahalgaon | Kaimur (Bhabua) | Katihar | Katoria | Khagaria | Kishanganj | Korha | Lakhisarai | Madhepura | Madhubani | Maharajganj | Mahua | Mairwa | Mallehpur | Masrakh | Mohania | Monghyr | Motihari | Motipur | Munger | Muzaffarpur | Nabinagar | Nalanda | Narkatiaganj | Naugachia | Nawada | Pakribarwan | Pakridayal | Patna | Phulparas | Piro | Pupri | Purena | Purnia | Rafiganj | Rajauli | Ramnagar | Raniganj | Raxaul | Rohtas | Rosera | S.Bakhtiarpur | Saharsa | Samastipur | Saran | Sasaram | Seikhpura | Sheikhpura | Sheohar | Sherghati | Sidhawalia | Singhwara | Sitamarhi | Siwan | Sonepur | Supaul | Thakurganj | Triveniganj | Udakishanganj | Vaishali | Wazirganj";
s_a[6] = " Chandigarh | Mani Marja";
s_a[7] = " Ambikapur | Antagarh | Arang | Bacheli | Bagbahera | Bagicha | Baikunthpur | Balod | Balodabazar | Balrampur | Barpalli | Basana | Bastanar | Bastar | Bderajpur | Bemetara | Berla | Bhairongarh | Bhanupratappur | Bharathpur | Bhatapara | Bhilai | Bhilaigarh | Bhopalpatnam | Bijapur | Bilaspur | Bodla | Bokaband | Chandipara | Chhinagarh | Chhuriakala | Chingmut | Chuikhadan | Dabhara | Dallirajhara | Dantewada | Deobhog | Dhamda | Dhamtari | Dharamjaigarh | Dongargarh | Durg | Durgakondal | Fingeshwar | Gariaband | Garpa | Gharghoda | Gogunda | Ilamidi | Jagdalpur | Janjgir | Janjgir-Champa | Jarwa | Jashpur | Jashpurnagar | Kabirdham-Kawardha | Kanker | Kasdol | Kathdol | Kathghora | Kawardha | Keskal | Khairgarh | Kondagaon | Konta | Korba | Korea | Kota | Koyelibeda | Kuakunda | Kunkuri | Kurud | Lohadigundah | Lormi | Luckwada | Mahasamund | Makodi | Manendragarh | Manpur | Marwahi | Mohla | Mungeli | Nagri | Narainpur | Narayanpur | Neora | Netanar | Odgi | Padamkot | Pakhanjur | Pali | Pandaria | Pandishankar | Parasgaon | Pasan | Patan | Pathalgaon | Pendra | Pratappur | Premnagar | Raigarh | Raipur | Rajnandgaon | Rajpur | Ramchandrapur | Saraipali | Saranggarh | Sarona | Semaria | Shakti | Sitapur | Sukma | Surajpur | Surguja | Tapkara | Toynar | Udaipur | Uproda | Wadrainagar";
s_a[8] = " Amal | Amli | Bedpa | Chikhli | Dadra & Nagar Haveli | Dahikhed | Dolara | Galonda | Kanadi | Karchond | Khadoli | Kharadpada | Kherabari | Kherdi | Kothar | Luari | Mashat | Rakholi | Rudana | Saili | Sili | Silvassa | Sindavni | Udva | Umbarkoi | Vansda | Vasona | Velugam ";
s_a[9] = " Brancavare | Dagasi | Daman | Diu | Magarvara | Nagwa | Pariali | Passo Covo ";
s_a[10] = " Central Delhi | East Delhi | New Delhi | North Delhi | North East Delhi | North West Delhi | South Delhi | South West Delhi | West Delhi ";
s_a[11] = " Canacona | Candolim | Chinchinim | Cortalim | Goa | Jua | Madgaon | Mahem | Mapuca | Marmagao | Panji | Ponda | Sanvordem | Terekhol ";
s_a[12] = " Ahmedabad | Ahwa | Amod | Amreli | Anand | Anjar | Ankaleshwar | Babra | Balasinor | Banaskantha | Bansada | Bardoli | Bareja | Baroda | Barwala | Bayad | Bhachav | Bhanvad | Bharuch | Bhavnagar | Bhiloda | Bhuj | Billimora | Borsad | Botad | Chanasma | Chhota Udaipur | Chotila | Dabhoi | Dahod | Damnagar | Dang | Danta | Dasada | Dediapada | Deesa | Dehgam | Deodar | Devgadhbaria | Dhandhuka | Dhanera | Dharampur | Dhari | Dholka | Dhoraji | Dhrangadhra | Dhrol | Dwarka | Fortsongadh | Gadhada | Gandhi Nagar | Gariadhar | Godhra | Gogodar | Gondal | Halol | Halvad | Harij | Himatnagar | Idar | Jambusar | Jamjodhpur | Jamkalyanpur | Jamnagar | Jasdan | Jetpur | Jhagadia | Jhalod | Jodia | Junagadh | Junagarh | Kalawad | Kalol | Kapad Wanj | Keshod | Khambat | Khambhalia | Khavda | Kheda | Khedbrahma | Kheralu | Kodinar | Kotdasanghani | Kunkawav | Kutch | Kutchmandvi | Kutiyana | Lakhpat | Lakhtar | Lalpur | Limbdi | Limkheda | Lunavada | M.M.Mangrol | Mahuva | Malia-Hatina | Maliya | Malpur | Manavadar | Mandvi | Mangrol | Mehmedabad | Mehsana | Miyagam | Modasa | Morvi | Muli | Mundra | Nadiad | Nakhatrana | Nalia | Narmada | Naswadi | Navasari | Nizar | Okha | Paddhari | Padra | Palanpur | Palitana | Panchmahals | Patan | Pavijetpur | Porbandar | Prantij | Radhanpur | Rahpar | Rajaula | Rajkot | Rajpipla | Ranavav | Sabarkantha | Sanand | Sankheda | Santalpur | Santrampur | Savarkundla | Savli | Sayan | Sayla | Shehra | Sidhpur | Sihor | Sojitra | Sumrasar | Surat | Surendranagar | Talaja | Thara | Tharad | Thasra | Una-Diu | Upleta | Vadgam | Vadodara | Valia | Vallabhipur | Valod | Valsad | Vanthali | Vapi | Vav | Veraval | Vijapur | Viramgam | Visavadar | Visnagar | Vyara | Waghodia | Wankaner ";
s_a[13] = " Adampur Mandi | Ambala | Assandh | Bahadurgarh | Barara | Barwala | Bawal | Bawanikhera | Bhiwani | Charkhidadri | Cheeka | Chhachrauli | Dabwali | Ellenabad | Faridabad | Fatehabad | Ferojpur Jhirka | Gharaunda | Gohana | Gurgaon | Hansi | Hisar | Jagadhari | Jatusana | Jhajjar | Jind | Julana | Kaithal | Kalanaur | Kalanwali | Kalka | Karnal | Kosli | Kurukshetra | Loharu | Mahendragarh | Meham | Mewat | Mohindergarh | Naraingarh | Narnaul | Narwana | Nilokheri | Nuh | Palwal | Panchkula | Panipat | Pehowa | Ratia | Rewari | Rohtak | Safidon | Sirsa | Siwani | Sonipat | Tohana | Tohsam | Yamunanagar ";
s_a[14] = " Amb | Arki | Banjar | Bharmour | Bilaspur | Chamba | Churah | Dalhousie | Dehra Gopipur | Hamirpur | Jogindernagar | Kalpa | Kangra | Kinnaur | Kullu | Lahaul | Mandi | Nahan | Nalagarh | Nirmand | Nurpur | Palampur | Pangi | Paonta | Pooh | Rajgarh | Rampur Bushahar | Rohru | Shimla | Sirmaur | Solan | Spiti | Sundernagar | Theog | Udaipur | Una";
s_a[15] = " Akhnoor | Anantnag | Badgam | Bandipur | Baramulla | Basholi | Bedarwah | Budgam | Doda | Gulmarg | Jammu | Kalakot | Kargil | Karnah | Kathua | Kishtwar | Kulgam | Kupwara | Leh | Mahore | Nagrota | Nobra | Nowshera | Nyoma | Padam | Pahalgam | Patnitop | Poonch | Pulwama | Rajouri | Ramban | Ramnagar | Reasi | Samba | Srinagar | Udhampur | Vaishno Devi ";
s_a[16] = " Bagodar | Baharagora | Balumath | Barhi | Barkagaon | Barwadih | Basia | Bermo | Bhandaria | Bhawanathpur | Bishrampur | Bokaro | Bolwa | Bundu | Chaibasa | Chainpur | Chakardharpur | Chandil | Chatra | Chavparan | Daltonganj | Deoghar | Dhanbad | Dumka | Dumri | Garhwa | Garu | Ghaghra | Ghatsila | Giridih | Godda | Gomia | Govindpur | Gumla | Hazaribagh | Hunterganj | Ichak | Itki | Jagarnathpur | Jamshedpur | Jamtara | Japla | Jharmundi | Jhinkpani | Jhumaritalaiya | Kathikund | Kharsawa | Khunti | Koderma | Kolebira | Latehar | Lohardaga | Madhupur | Mahagama | Maheshpur Raj | Mandar | Mandu | Manoharpur | Muri | Nagarutatri | Nala | Noamundi | Pakur | Palamu | Palkot | Patan | Rajdhanwar | Rajmahal | Ramgarh | Ranchi | Sahibganj | Saraikela | Simaria | Simdega | Singhbhum | Tisri | Torpa ";
s_a[17] = " Afzalpur | Ainapur | Aland | Alur | Anekal | Ankola | Arsikere | Athani | Aurad | Bableshwar | Badami | Bagalkot | Bagepalli | Bailhongal | Bangalore | Bangalore Rural | Bangarpet | Bantwal | Basavakalyan | Basavanabagewadi | Basavapatna | Belgaum | Bellary | Belthangady | Belur | Bhadravati | Bhalki | Bhatkal | Bidar | Bijapur | Biligi | Chadchan | Challakere | Chamrajnagar | Channagiri | Channapatna | Channarayapatna | Chickmagalur | Chikballapur | Chikkaballapur | Chikkanayakanahalli | Chikkodi | Chikmagalur | Chincholi | Chintamani | Chitradurga | Chittapur | Cowdahalli | Davanagere | Deodurga | Devangere | Devarahippargi | Dharwad | Doddaballapur | Gadag | Gangavathi | Gokak | Gowribdanpur | Gubbi | Gulbarga | Gundlupet | H.B.Halli | H.D. Kote | Haliyal | Hampi | Hangal | Harapanahalli | Hassan | Haveri | Hebri | Hirekerur | Hiriyur | Holalkere | Holenarsipur | Honnali | Honnavar | Hosadurga | Hosakote | Hosanagara | Hospet | Hubli | Hukkeri | Humnabad | Hungund | Hunsagi | Hunsur | Huvinahadagali | Indi | Jagalur | Jamkhandi | Jewargi | Joida | K.R. Nagar | Kadur | Kalghatagi | Kamalapur | Kanakapura | Kannada | Kargal | Karkala | Karwar | Khanapur | Kodagu | Kolar | Kollegal | Koppa | Koppal | Koratageri | Krishnarajapet | Kudligi | Kumta | Kundapur | Kundgol | Kunigal | Kurugodu | Kustagi | Lingsugur | Madikeri | Madugiri | Malavalli | Malur | Mandya | Mangalore | Manipal | Manvi | Mashal | Molkalmuru | Mudalgi | Muddebihal | Mudhol | Mudigere | Mulbagal | Mundagod | Mundargi | Murugod | Mysore | Nagamangala | Nanjangud | Nargund | Narsimrajapur | Navalgund | Nelamangala | Nimburga | Pandavapura | Pavagada | Puttur | Raibag | Raichur | Ramdurg | Ranebennur | Ron | Sagar | Sakleshpur | Salkani | Sandur | Saundatti | Savanur | Sedam | Shahapur | Shankarnarayana | Shikaripura | Shimoga | Shirahatti | Shorapur | Siddapur | Sidlaghatta | Sindagi | Sindhanur | Sira | Sirsi | Siruguppa | Somwarpet | Sorab | Sringeri | Sriniwaspur | Srirangapatna | Sullia | T. Narsipur | Tallak | Tarikere | Telgi | Thirthahalli | Tiptur | Tumkur | Turuvekere | Udupi | Virajpet | Wadi | Yadgiri | Yelburga | Yellapur ";
s_a[18] = " Adimaly | Adoor | Agathy | Alappuzha | Alathur | Alleppey | Alwaye | Amini | Androth | Attingal | Badagara | Bitra | Calicut | Cannanore | Chetlet | Ernakulam | Idukki | Irinjalakuda | Kadamath | Kalpeni | Kalpetta | Kanhangad | Kanjirapally | Kannur | Karungapally | Kasargode | Kavarathy | Kiltan | Kochi | Koduvayur | Kollam | Kottayam | Kovalam | Kozhikode | Kunnamkulam | Malappuram | Mananthodi | Manjeri | Mannarghat | Mavelikkara | Minicoy | Munnar | Muvattupuzha | Nedumandad | Nedumgandam | Nilambur | Palai | Palakkad | Palghat | Pathaanamthitta | Pathanamthitta | Payyanur | Peermedu | Perinthalmanna | Perumbavoor | Punalur | Quilon | Ranni | Shertallai | Shoranur | Taliparamba | Tellicherry | Thiruvananthapuram | Thodupuzha | Thrissur | Tirur | Tiruvalla | Trichur | Trivandrum | Uppala | Vadakkanchery | Vikom | Wayanad ";
s_a[19] = " Agatti Island | Bingaram Island | Bitra Island | Chetlat Island | Kadmat Island | Kalpeni Island | Kavaratti Island | Kiltan Island | Lakshadweep Sea | Minicoy Island | North Island | South Island ";
s_a[20] = " Agar | Ajaigarh | Alirajpur | Amarpatan | Amarwada | Ambah | Anuppur | Arone | Ashoknagar | Ashta | Atner | Babaichichli | Badamalhera | Badarwsas | Badnagar | Badnawar | Badwani | Bagli | Baihar | Balaghat | Baldeogarh | Baldi | Bamori | Banda | Bandhavgarh | Bareli | Baroda | Barwaha | Barwani | Batkakhapa | Begamganj | Beohari | Berasia | Berchha | Betul | Bhainsdehi | Bhander | Bhanpura | Bhikangaon | Bhimpur | Bhind | Bhitarwar | Bhopal | Biaora | Bijadandi | Bijawar | Bijaypur | Bina | Birsa | Birsinghpur | Budhni | Burhanpur | Buxwaha | Chachaura | Chanderi | Chaurai | Chhapara | Chhatarpur | Chhindwara | Chicholi | Chitrangi | Churhat | Dabra | Damoh | Datia | Deori | Deosar | Depalpur | Dewas | Dhar | Dharampuri | Dindori | Gadarwara | Gairatganj | Ganjbasoda | Garoth | Ghansour | Ghatia | Ghatigaon | Ghorandogri | Ghughari | Gogaon | Gohad | Goharganj | Gopalganj | Gotegaon | Gourihar | Guna | Gunnore | Gwalior | Gyraspur | Hanumana | Harda | Harrai | Harsud | Hatta | Hoshangabad | Ichhawar | Indore | Isagarh | Itarsi | Jabalpur | Jabera | Jagdalpur | Jaisinghnagar | Jaithari | Jaitpur | Jaitwara | Jamai | Jaora | Jatara | Jawad | Jhabua | Jobat | Jora | Kakaiya | Kannod | Kannodi | Karanjia | Kareli | Karera | Karhal | Karpa | Kasrawad | Katangi | Katni | Keolari | Khachrod | Khajuraho | Khakner | Khalwa | Khandwa | Khaniadhana | Khargone | Khategaon | Khetia | Khilchipur | Khirkiya | Khurai | Kolaras | Kotma | Kukshi | Kundam | Kurwai | Kusmi | Laher | Lakhnadon | Lamta | Lanji | Lateri | Laundi | Maheshwar | Mahidpurcity | Maihar | Majhagwan | Majholi | Malhargarh | Manasa | Manawar | Mandla | Mandsaur | Manpur | Mauganj | Mawai | Mehgaon | Mhow | Morena | Multai | Mungaoli | Nagod | Nainpur | Narsingarh | Narsinghpur | Narwar | Nasrullaganj | Nateran | Neemuch | Niwari | Niwas | Nowgaon | Pachmarhi | Pandhana | Pandhurna | Panna | Parasia | Patan | Patera | Patharia | Pawai | Petlawad | Pichhore | Piparia | Pohari | Prabhapattan | Punasa | Pushprajgarh | Raghogarh | Raghunathpur | Rahatgarh | Raisen | Rajgarh | Rajpur | Ratlam | Rehli | Rewa | Sabalgarh | Sagar | Sailana | Sanwer | Sarangpur | Sardarpur | Satna | Saunsar | Sehore | Sendhwa | Seondha | Seoni | Seonimalwa | Shahdol | Shahnagar | Shahpur | Shajapur | Sheopur | Sheopurkalan | Shivpuri | Shujalpur | Sidhi | Sihora | Silwani | Singrauli | Sirmour | Sironj | Sitamau | Sohagpur | Sondhwa | Sonkatch | Susner | Tamia | Tarana | Tendukheda | Teonthar | Thandla | Tikamgarh | Timarani | Udaipura | Ujjain | Umaria | Umariapan | Vidisha | Vijayraghogarh | Waraseoni | Zhirnia ";
s_a[21] = " Achalpur | Aheri | Ahmednagar | Ahmedpur | Ajara | Akkalkot | Akola | Akole | Akot | Alibagh | Amagaon | Amalner | Ambad | Ambejogai | Amravati | Arjuni Merogaon | Arvi | Ashti | Atpadi | Aurangabad | Ausa | Babhulgaon | Balapur | Baramati | Barshi Takli | Barsi | Basmatnagar | Bassein | Beed | Bhadrawati | Bhamregadh | Bhandara | Bhir | Bhiwandi | Bhiwapur | Bhokar | Bhokardan | Bhoom | Bhor | Bhudargad | Bhusawal | Billoli | Brahmapuri | Buldhana | Butibori | Chalisgaon | Chamorshi | Chandgad | Chandrapur | Chandur | Chanwad | Chhikaldara | Chikhali | Chinchwad | Chiplun | Chopda | Chumur | Dahanu | Dapoli | Darwaha | Daryapur | Daund | Degloor | Delhi Tanda | Deogad | Deolgaonraja | Deori | Desaiganj | Dhadgaon | Dhanora | Dharani | Dhiwadi | Dhule | Dhulia | Digras | Dindori | Edalabad | Erandul | Etapalli | Gadhchiroli | Gadhinglaj | Gaganbavada | Gangakhed | Gangapur | Gevrai | Ghatanji | Golegaon | Gondia | Gondpipri | Goregaon | Guhagar | Hadgaon | Hatkangale | Hinganghat | Hingoli | Hingua | Igatpuri | Indapur | Islampur | Jalgaon | Jalna | Jamkhed | Jamner | Jath | Jawahar | Jintdor | Junnar | Kagal | Kaij | Kalamb | Kalamnuri | Kallam | Kalmeshwar | Kalwan | Kalyan | Kamptee | Kandhar | Kankavali | Kannad | Karad | Karjat | Karmala | Katol | Kavathemankal | Kedgaon | Khadakwasala | Khamgaon | Khed | Khopoli | | Kalamboli | Khultabad | Kinwat | Kolhapur | Kopargaon | Koregaon | Kudal | Kuhi | Kurkheda | Kusumba | Lakhandur | Langa | Latur | Lonar | Lonavala | Madangad | Madha | Mahabaleshwar | Mahad | Mahagaon | Mahasala | Mahaswad | Malegaon | Malgaon | Malgund | Malkapur | Malsuras | Malwan | Mancher | Mangalwedha | Mangaon | Mangrulpur | Manjalegaon | Manmad | Maregaon | Mehda | Mekhar | Mohadi | Mohol | Mokhada | Morshi | Mouda | Mukhed | Mul | Mumbai | Murbad | Murtizapur | Murud | Nagbhir | Nagpur | Nahavara | Nanded | Nandgaon | Nandnva | Nandurbar | Narkhed | Nashik | Navapur | Ner | Newasa | Nilanga | Niphad | Omerga | Osmanabad | Pachora | Paithan | Palghar | Pali | Pandharkawada | Pandharpur | Panhala | Paranda | Parbhani | Parner | Parola | Parseoni | Partur | Patan | Pathardi | Pathari | Patoda | Pauni | Peint | Pen | Phaltan | Pimpalner | Pirangut | Poladpur | Pune | Pusad | Pusegaon | Radhanagar | Rahuri | Raigad | Rajapur | Rajgurunagar | Rajura | Ralegaon | Ramtek | Ratnagiri | Raver | Risod | Roha | Sakarwadi | Sakoli | Sakri | Salekasa | Samudrapur | Sangamner | Sanganeshwar | Sangli | Sangola | Sanguem | Saoner | Saswad | Satana | Satara | Sawantwadi | Seloo | Shahada | Shahapur | Shahuwadi | Shevgaon | Shirala | Shirol | Shirpur | Shirur | Shirwal | Sholapur | Shri Rampur | Shrigonda | Shrivardhan | Sillod | Sinderwahi | Sindhudurg | Sindkheda | Sindkhedaraja | Sinnar | Sironcha | Soyegaon | Surgena | Talasari | Talegaon S.Ji Pant | Taloda | Tasgaon | Thane | Tirora | Tiwasa | Trimbak | Tuljapur | Tumsar | Udgir | Umarkhed | Umrane | Umrer | Urlikanchan | Vaduj | Velhe | Vengurla | Vijapur | Vita | Wada | Wai | Walchandnagar | Wani | Wardha | Warlydwarud | Warora | Washim | Wathar | Yavatmal | Yawal | Yeola | Yeotmal ";
s_a[22] = " Bishnupur | Chakpikarong | Chandel | Chattrik | Churachandpur | Imphal | Jiribam | Kakching | Kalapahar | Mao | Mulam | Parbung | Sadarhills | Saibom | Sempang | Senapati | Sochumer | Taloulong | Tamenglong | Thinghat | Thoubal | Ukhrul ";
s_a[23] = " Amlaren | Baghmara | Cherrapunjee | Dadengiri | Garo Hills | Jaintia Hills | Jowai | Khasi Hills | Khliehriat | Mariang | Mawkyrwat | Nongpoh | Nongstoin | Resubelpara | Ri Bhoi | Shillong | Tura | Williamnagar";
s_a[24] = " Aizawl | Champhai | Demagiri | Kolasib | Lawngtlai | Lunglei | Mamit | Saiha | Serchhip";
s_a[25] = " Dimapur | Jalukie | Kiphire | Kohima | Mokokchung | Mon | Phek | Tuensang | Wokha | Zunheboto ";
s_a[26] = " Anandapur | Angul | Anugul | Aska | Athgarh | Athmallik | Attabira | Bagdihi | Balangir | Balasore | Baleswar | Baliguda | Balugaon | Banaigarh | Bangiriposi | Barbil | Bargarh | Baripada | Barkot | Basta | Berhampur | Betanati | Bhadrak | Bhanjanagar | Bhawanipatna | Bhubaneswar | Birmaharajpur | Bisam Cuttack | Boriguma | Boudh | Buguda | Chandbali | Chhatrapur | Chhendipada | Cuttack | Daringbadi | Daspalla | Deodgarh | Deogarh | Dhanmandal | Dharamgarh | Dhenkanal | Digapahandi | Dunguripali | G. Udayagiri | Gajapati | Ganjam | Ghatgaon | Gudari | Gunupur | Hemgiri | Hindol | Jagatsinghapur | Jajpur | Jamankira | Jashipur | Jayapatna | Jeypur | Jharigan | Jharsuguda | Jujumura | Kalahandi | Kalimela | Kamakhyanagar | Kandhamal | Kantabhanji | Kantamal | Karanjia | Kashipur | Kendrapara | Kendujhar | Keonjhar | Khalikote | Khordha | Khurda | Komana | Koraput | Kotagarh | Kuchinda | Lahunipara | Laxmipur | M. Rampur | Malkangiri | Mathili | Mayurbhanj | Mohana | Motu | Nabarangapur | Naktideul | Nandapur | Narlaroad | Narsinghpur | Nayagarh | Nimapara | Nowparatan | Nowrangapur | Nuapada | Padampur | Paikamal | Palla Hara | Papadhandi | Parajang | Pardip | Parlakhemundi | Patnagarh | Pattamundai | Phiringia | Phulbani | Puri | Puruna Katak | R. Udayigiri | Rairakhol | Rairangpur | Rajgangpur | Rajkhariar | Rayagada | Rourkela | Sambalpur | Sohela | Sonapur | Soro | Subarnapur | Sunabeda | Sundergarh | Surada | T. Rampur | Talcher | Telkoi | Titlagarh | Tumudibandha | Udala | Umerkote ";
s_a[27] = " Bahur | Karaikal | Mahe | Pondicherry | Purnankuppam | Valudavur | Villianur | Yanam ";
s_a[28] = " Abohar | Ajnala | Amritsar | Balachaur | Barnala | Batala | Bathinda | Chandigarh | Dasua | Dinanagar | Faridkot | Fatehgarh Sahib | Fazilka | Ferozepur | Garhashanker | Goindwal | Gurdaspur | Guruharsahai | Hoshiarpur | Jagraon | Jalandhar | Jugial | Kapurthala | Kharar | Kotkapura | Ludhiana | Malaut | Malerkotla | Mansa | Moga | Muktasar | Nabha | Nakodar | Nangal | Nawanshahar | Nawanshahr | Pathankot | Patiala | Patti | Phagwara | Phillaur | Phulmandi | Quadian | Rajpura | Raman | Rayya | Ropar | Rupnagar | Samana | Samrala | Sangrur | Sardulgarh | Sarhind | SAS Nagar | Sultanpur Lodhi | Sunam | Tanda Urmar | Tarn Taran | Zira ";
s_a[29] = " Abu Road | Ahore | Ajmer | Aklera | Alwar | Amber | Amet | Anupgarh | Asind | Aspur | Atru | Bagidora | Bali | Bamanwas | Banera | Bansur | Banswara | Baran | Bari | Barisadri | Barmer | Baseri | Bassi | Baswa | Bayana | Beawar | Begun | Behror | Bhadra | Bharatpur | Bhilwara | Bhiwadi | Bhim | Bhinmal | Bikaner | Bilara | Bundi | Chhabra | Chhipaborad | Chirawa | Chittorgarh | Chohtan | Churu | Dantaramgarh | Dausa | Deedwana | Deeg | Degana | Deogarh | Deoli | Desuri | Dhariawad | Dholpur | Digod | Dudu | Dungarpur | Dungla | Fatehpur | Gangapur | Gangdhar | Gerhi | Ghatol | Girwa | Gogunda | Hanumangarh | Hindaun | Hindoli | Hurda | Jahazpur | Jaipur | Jaisalmer | Jalore | Jhalawar | Jhunjhunu | Jodhpur | Kaman | Kapasan | Karauli | Kekri | Keshoraipatan | Khandar | Kherwara | Khetri | Kishanganj | Kishangarh | Kishangarhbas | Kolayat | Kota | Kotputli | Kotra | Kotri | Kumbalgarh | Kushalgarh | Ladnun | Ladpura | Lalsot | Laxmangarh | Lunkaransar | Mahuwa | Malpura | Malvi | Mandal | Mandalgarh | Mandawar | Mangrol | Marwar-Jn | Merta | Nadbai | Nagaur | Nainwa | Nasirabad | Nathdwara | Nawa | Neem Ka Thana | Newai | Nimbahera | Nohar | Nokha | Onli | Osian | Pachpadara | Pachpahar | Padampur | Pali | Parbatsar | Phagi | Phalodi | Pilani | Pindwara | Pipalda | Pirawa | Pokaran | Pratapgarh | Raipur | Raisinghnagar | Rajgarh | Rajsamand | Ramganj Mandi | Ramgarh | Rashmi | Ratangarh | Reodar | Rupbas | Sadulshahar | Sagwara | Sahabad | Salumber | Sanchore | Sangaria | Sangod | Sapotra | Sarada | Sardarshahar | Sarwar | Sawai Madhopur | Shahapura | Sheo | Sheoganj | Shergarh | Sikar | Sirohi | Siwana | Sojat | Sri Dungargarh | Sri Ganganagar | Sri Karanpur | Sri Madhopur | Sujangarh | Taranagar | Thanaghazi | Tibbi | Tijara | Todaraisingh | Tonk | Udaipur | Udaipurwati | Uniayara | Vallabhnagar | Viratnagar ";
s_a[30] = " Barmiak | Be | Bhurtuk | Chhubakha | Chidam | Chubha | Chumikteng | Dentam | Dikchu | Dzongri | Gangtok | Gauzing | Gyalshing | Hema | Kerung | Lachen | Lachung | Lema | Lingtam | Lungthu | Mangan | Namchi | Namthang | Nanga | Nantang | Naya Bazar | Padamachen | Pakhyong | Pemayangtse | Phensang | Rangli | Rinchingpong | Sakyong | Samdong | Singtam | Siniolchu | Sombari | Soreng | Sosing | Tekhug | Temi | Tsetang | Tsomgo | Tumlong | Yangang | Yumtang ";
s_a[31] = " Ambasamudram | Anamali | Arakandanallur | Arantangi | Aravakurichi | Ariyalur | Arkonam | Arni | Aruppukottai | Attur | Avanashi | Batlagundu | Bhavani | Chengalpattu | Chengam | Chennai | Chidambaram | Chingleput | Coimbatore | Courtallam | Cuddalore | Cumbum | Denkanikoitah | Devakottai | Dharampuram | Dharmapuri | Dindigul | Erode | Gingee | Gobichettipalayam | Gudalur | Gudiyatham | Harur | Hosur | Jayamkondan | Kallkurichi | Kanchipuram | Kangayam | Kanyakumari | Karaikal | Karaikudi | Karur | Keeranur | Kodaikanal | Kodumudi | Kotagiri | Kovilpatti | Krishnagiri | Kulithalai | Kumbakonam | Kuzhithurai | Madurai | Madurantgam | Manamadurai | Manaparai | Mannargudi | Mayiladuthurai | Mayiladutjurai | Mettupalayam | Metturdam | Mudukulathur | Mulanur | Musiri | Nagapattinam | Nagarcoil | Namakkal | Nanguneri | Natham | Neyveli | Nilgiris | Oddanchatram | Omalpur | Ootacamund | Ooty | Orathanad | Palacode | Palani | Palladum | Papanasam | Paramakudi | Pattukottai | Perambalur | Perundurai | Pollachi | Polur | Pondicherry | Ponnamaravathi | Ponneri | Pudukkottai | Rajapalayam | Ramanathapuram | Rameshwaram | Ranipet | Rasipuram | Salem | Sankagiri | Sankaran | Sathiyamangalam | Sivaganga | Sivakasi | Sriperumpudur | Srivaikundam | Tenkasi | Thanjavur | Theni | Thirumanglam | Thiruraipoondi | Thoothukudi | Thuraiyure | Tindivanam | Tiruchendur | Tiruchengode | Tiruchirappalli | Tirunelvelli | Tirupathur | Tirupur | Tiruttani | Tiruvallur | Tiruvannamalai | Tiruvarur | Tiruvellore | Tiruvettipuram | Trichy | Tuticorin | Udumalpet | Ulundurpet | Usiliampatti | Uthangarai | Valapady | Valliyoor | Vaniyambadi | Vedasandur | Vellore | Velur | Vilathikulam | Villupuram | Virudhachalam | Virudhunagar | Wandiwash | Yercaud ";
s_a[32] = "Adilabad | Bhadradri | Kothagudem | Hyderabad | Jagtial | Jangaon | Jayashankar | Bhoopalpally | Jogulamba Gadwal | Kamareddy | Karimnagar | KhammamKomaram Bheem | Asifabad | Mahabubabad | Mahabubnagar | Mancherial | Medak | Medchal | Nagarkurnool | Nalgonda | Nirmal | Nizamabad | Peddapalli | Rajanna Sircilla | Rangareddy | Sangareddy | Siddipet | Suryapet | Vikarabad | Wanaparthy | Warangal (Rural)| Warangal (Urban) | Yadadri Bhuvanagir";
s_a[33] = " Agartala | Ambasa | Bampurbari | Belonia | Dhalai | Dharam Nagar | Kailashahar | Kamal Krishnabari | Khopaiyapara | Khowai | Phuldungsei | Radha Kishore Pur | Tripura ";
s_a[34] = " Achhnera | Agra | Akbarpur | Aliganj | Aligarh | Allahabad | Ambedkar Nagar | Amethi | Amiliya | Amroha | Anola | Atrauli | Auraiya | Azamgarh | Baberu | Badaun | Baghpat | Bagpat | Baheri | Bahraich | Ballia | Balrampur | Banda | Bansdeeh | Bansgaon | Bansi | Barabanki | Bareilly | Basti | Bhadohi | Bharthana | Bharwari | Bhogaon | Bhognipur | Bidhuna | Bijnore | Bikapur | Bilari | Bilgram | Bilhaur | Bindki | Bisalpur | Bisauli | Biswan | Budaun | Budhana | Bulandshahar | Bulandshahr | Capianganj | Chakia | Chandauli | Charkhari | Chhata | Chhibramau | Chirgaon | Chitrakoot | Chunur | Dadri | Dalmau | Dataganj | Debai | Deoband | Deoria | Derapur | Dhampur | Domariyaganj | Dudhi | Etah | Etawah | Faizabad | Farrukhabad | Fatehpur | Firozabad | Garauth | Garhmukteshwar | Gautam Buddha Nagar | Ghatampur | Ghaziabad | Ghazipur | Ghosi | Gonda | Gorakhpur | Gunnaur | Haidergarh | Hamirpur | Hapur | Hardoi | Harraiya | Hasanganj | Hasanpur | Hathras | Jalalabad | Jalaun | Jalesar | Jansath | Jarar | Jasrana | Jaunpur | Jhansi | Jyotiba Phule Nagar | Kadipur | Kaimganj | Kairana | Kaisarganj | Kalpi | Kannauj | Kanpur | Karchhana | Karhal | Karvi | Kasganj | Kaushambi | Kerakat | Khaga | Khair | Khalilabad | Kheri | Konch | Kumaon | Kunda | Kushinagar | Lalganj | Lalitpur | Lucknow | Machlishahar | Maharajganj | Mahoba | Mainpuri | Malihabad | Mariyahu | Math | Mathura | Mau | Maudaha | Maunathbhanjan | Mauranipur | Mawana | Meerut | Mehraun | Meja | Mirzapur | Misrikh | Modinagar | Mohamdabad | Mohamdi | Moradabad | Musafirkhana | Muzaffarnagar | Nagina | Najibabad | Nakur | Nanpara | Naraini | Naugarh | Nawabganj | Nighasan | Noida | Orai | Padrauna | Pahasu | Patti | Pharenda | Phoolpur | Phulpur | Pilibhit | Pitamberpur | Powayan | Pratapgarh | Puranpur | Purwa | Raibareli | Rampur | Ramsanehi Ghat | Rasara | Rath | Robertsganj | Sadabad | Safipur | Sagri | Saharanpur | Sahaswan | Sahjahanpur | Saidpur | Salempur | Salon | Sambhal | Sandila | Sant Kabir Nagar | Sant Ravidas Nagar | Sardhana | Shahabad | Shahganj | Shahjahanpur | Shikohabad | Shravasti | Siddharthnagar | Sidhauli | Sikandra Rao | Sikandrabad | Sitapur | Siyana | Sonbhadra | Soraon | Sultanpur | Tanda | Tarabganj | Tilhar | Unnao | Utraula | Varanasi | Zamania ";
s_a[35] = " Almora | Bageshwar | Bhatwari | Chakrata | Chamoli | Champawat | Dehradun | Deoprayag | Dharchula | Dunda | Haldwani | Haridwar | Joshimath | Karan Prayag | Kashipur | Khatima | Kichha | Lansdown | Munsiari | Mussoorie | Nainital | Pantnagar | Partapnagar | Pauri Garhwal | Pithoragarh | Purola | Rajgarh | Ranikhet | Roorkee | Rudraprayag | Tehri Garhwal | Udham Singh Nagar | Ukhimath | Uttarkashi ";
s_a[36] = " Adra | Alipurduar | Amlagora | Arambagh | Asansol | Balurghat | Bankura | Bardhaman | Basirhat | Berhampur | Bethuadahari | Birbhum | Birpara | Bishanpur | Bolpur | Bongoan | Bulbulchandi | Burdwan  | Canning | Champadanga | Contai | Cooch Behar | Daimond Harbour | Dalkhola | Dantan | Darjeeling | Dhaniakhali | Dhuliyan | Dinajpur | Dinhata | Durgapur | Gangajalghati | Gangarampur | Ghatal | Guskara | Habra | Haldia | Harirampur | Harishchandrapur | Hooghly | Howrah | Islampur | Jagatballavpur | Jalpaiguri | Jhalda | Jhargram | Kakdwip | Kolkata | Kalchini | Kalimpong | Kalna | Kandi | Karimpur | Katwa | Kharagpur | Khatra | Krishnanagar | Mal Bazar | Malda | Manbazar | Mathabhanga | Medinipur | Mekhliganj | Mirzapur | Murshidabad | Nadia | Nagarakata | Nalhati | Nayagarh | Parganas | Purulia | Raiganj | Rampur Hat | Ranaghat | Seharabazar | Siliguri | Suri | Takipur | Tamluk";

function print_state(state_id) {
    // given the id of the <select> tag as function argument, it inserts <option> tags
    var option_str = document.getElementById(state_id);
    if (option_str != null) {
        option_str.length = 0;
        option_str.options[0] = new Option('Select State', '');
        option_str.selectedIndex = 0;
        for (var i = 0; i < state_arr.length; i++) {
            option_str.options[option_str.length] = new Option(state_arr[i], state_arr[i]);
        }
    }

}

function print_city(city_id, city_index) {
    var option_str = document.getElementById(city_id);
    option_str.length = 0;	// Fixed by Julian Woods
    option_str.options[0] = new Option('Select City', '');
    option_str.selectedIndex = 0;
    if (city_index != -1) {
        var city_arr = s_a[city_index].split("|");
        for (var i = 0; i < city_arr.length; i++) {
            option_str.options[option_str.length] = new Option(city_arr[i], city_arr[i]);
        }
    }
}
function Notifications() {

    $.ajax({
        type: 'Post',
        url: "api/TaskController/Notifications",

        success: function (data) {
            if (data.success) {

                var tasktile = data.data.tasktitle;
                var user = data.data.sendername;
                Swal.fire({
                    title: `<span>Task Title : ${tasktile} </span>`,
                    iconHtml: '<i class="fa fa-tasks" style="font-size:36px"></i>',

                    html:
                        `You Have A Task from <b>${user}</b>, `,
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText:
                        '<a class="fa fa-eye" href="../TaskDashboard"></a> View',

                    cancelButtonText:
                        '<i class="fa fa-close danger">Skip</i>',

                })
            }
        }
    });
}
function PendingNotifications() {

    $.ajax({
        type: 'Post',
        url: "api/TaskController/PendingNotifications",

        success: function (data) {
            if (data.success) {
                document.getElementById("taskcounter").innerHTML = data.countt;
                Swal.fire({
                    title: `<span> Pending Task</span>`,
                    iconHtml: '<i class="fa fa-tasks" style="font-size:36px"></i>',

                    html:
                        `You Have A <b style="color:red">(${data.countt})</b> Pending Task. Complete as soon as possible`,
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText:
                        '<a style="color:white" class="fa fa-eye" href="../TaskDashboard">View</a> ',
                    cancelButtonText:
                        '<i class="fa fa-close danger">Skip</i>',

                })
                play();
            }
        }
    });


}
function Notificationscounter() {
    $.ajax({
        type: 'Post',
        url: "api/TaskController/NotificationsCounter",

        success: function (data) {
            if (data.success) {
                document.getElementById("taskcounter").innerHTML = data.countt;
            }
        }
    });


}
function hideSearchReport() {
    $("#searchReportDiv").hide(150);
}
function viewperiod() {
    var periodcheck = document.getElementById("periodcheck").checked;
    if (periodcheck == true) {
        document.getElementById("periodDiv").style.display = "block";
        document.getElementById("SearchDiv").style.display = "none";
    } else {
        document.getElementById("SearchDiv").style.display = "block";
        document.getElementById("periodDiv").style.display = "none";
    }
}
function taskCloseRequestNotifications() {

    $.ajax({
        type: 'Post',
        url: "api/TaskController/CloseRequestNotifications",

        success: function (data) {
            if (data.success) {

                var closetitle = data.data.receivername;
                /* var closetitle =  ;*/
                Swal.fire({
                    title: `<span> Close Task</span>`,
                    iconHtml: '<span style="font-size:36px">🙏</i>',

                    html:
                        `You Have A Close Request from <b style="color:red">(${closetitle})</b>Please Close his/Her Task`,
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText:
                        '<a style="color:white" class="fa fa-eye";   href="../TaskDashboard">View</a> ',


                    cancelButtonText:
                        '<i class="fa fa-close danger">Skip</i>',

                })

            }
        }
    });

}
function play() {
    var audio = new Audio("../AudioFiles/Notification.mp3");
    audio.play();
}
function LogsDetails(voucherNo, button, type, vch, nos) {
    if (vch != "") {
        document.getElementById("vchdisp").style.display = "block";
        document.getElementById("vchno1").innerHTML = voucherNo;
    }
    else {
        document.getElementById("vchdisp").style.display = "none";
    }
    var row = $(button).closest("TR");
    var dono = $("TD", row).eq(nos).html();
    document.getElementById("logsCompanyName").innerHTML = dono;

    dataTable = $("#logsDatatable").DataTable({
        ajax: {
            'url': '/api/Client/fetchLogs',
            'type': 'GET',
            'data': {
                voucherType: type,
                ID: voucherNo,
            },
            'contentType': 'application/json',
        },
        columns: [
            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'usreName', 'defaultContent': '-', 'width': '10%' },
            {
                'data': 'date', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MMM-YYYY HH:mm ');
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '5%', 'font-size': '6px'
            },
            { 'data': 'description', 'defaultContent': '-', 'width': '10%' },

        ],
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": true,
        "info": false,
        "autoWidth": false,
        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });
    dataTable.on('order.dt', function () {
        dataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}

function logout() {
    $.ajax({
        type: "post",
        url: "api/Login/Logout",
        success: function (data) {
            if (data.success) {
                window.location.replace("Index");
            }
            else {
                toastr.error(data.message);
            }
        }

    });
}