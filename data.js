   const R1 = [
            {t:'ab',d:[{tA:"COCA-COLA",tB:"PEPSI",iA:"https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",iB:"https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400"},{tA:"IPHONE",tB:"ANDROID",iA:"https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400",iB:"https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400"},{tA:"NIKE",tB:"ADIDAS",iA:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",iB:"https://images.unsplash.com/photo-1518002171953-a080ee802e12?w=400"},{tA:"RUMBA",tB:"NETFLIX",iA:"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",iB:"https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400"},{tA:"UBER",tB:"TRANSMI",iA:"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400",iB:"https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400"}]},
            {t:'mascot'},
            {t:'bomb', d:[ {q:"¿IPHONE O SAMSUNG?", a:["IPHONE","SAMSUNG"]}, {q:"¿NIKE O ADIDAS?", a:["NIKE","ADIDAS"]}, {q:"¿PLAYA O CIUDAD?", a:["PLAYA","CIUDAD"]}, {q:"¿EFECTIVO O TARJETA?", a:["EFECTIVO","TARJETA"]}, {q:"¿SALIR O DORMIR?", a:["SALIR","DORMIR"]} ]},
            {t:'grid',q:'TU EDAD',i:['18-24','25-34','35-44','45+']},
            {t:'slider',q:'TU INGRESO MENSUAL',min:0,max:10000000,step:500000},
            {t:'ab',d:[{tA:"HAMBURGUESA",tB:"PIZZA",iA:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",iB:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"},{tA:"REGGAETON",tB:"ROCK",iA:"https://images.unsplash.com/photo-1621693247912-c9695372561e?w=400",iB:"https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400"},{tA:"ZARA",tB:"H&M",iA:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",iB:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400"}]},
            {t:'fire', d:[ "¿HAS SIDO INFIEL?", "¿MIENTES EN TU CV?", "¿ODIAS A TU JEFE?", "¿ROBARÍAS SI NADIE TE VE?", "¿REVISAS CELULARES AJENOS?", "¿TE IRÍAS DEL PAÍS MAÑANA?" ]},
            {t:'grid',q:'TU BANCO PRINCIPAL',i:['BANCOLOMBIA','DAVIVIENDA','NU','NEQUI','BOGOTÁ','NINGUNO']},
            {t:'acc'},
            {t:'truth',d:[{q:"¿TIENES DEUDAS?",i:"fa-money-bill-wave"},{q:"¿FUMAS VAPE?",i:"fa-smoking"},{q:"¿HAS MENTIDO EN CV?",i:"fa-file-alt"}]}
        ];
        
        const R2 = [
            {t:'ab',d:[{tA:"EFECTIVO",tB:"APPS",iA:"https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400",iB:"https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=400"},{tA:"JUAN VALDEZ",tB:"STARBUCKS",iA:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",iB:"https://images.unsplash.com/photo-1507133750069-bef9d5b4537a?w=400"},{tA:"PERRO",tB:"GATO",iA:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",iB:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"}]},
            {t:'slider',q:'GASTO MAX ZAPATOS',min:50000,max:800000,step:20000},
            {t:'grid',q:'TIENES VEHÍCULO',i:['CARRO','MOTO','BICI','NINGUNO']},
            {t:'casino'},
            {t:'ab',d:[{tA:"PLAYA",tB:"MONTAÑA",iA:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",iB:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400"},{tA:"MAC",tB:"WINDOWS",iA:"https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400",iB:"https://images.unsplash.com/photo-1542393545-facac7050887?w=400"},{tA:"NACIONAL",tB:"IMPORTADA",iA:"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=400",iB:"https://images.unsplash.com/photo-1567696911980-2c0c8dd84261?w=400"}]},
            {t:'grid',q:'NIVEL EDUCATIVO',i:['BACHILLER','TÉCNICO','UNIVERSIDAD','POSGRADO']},
            {t:'truth',d:[{q:"¿COMPRA IMPULSIVA?",i:"fa-shopping-cart"},{q:"¿PROBLEMAS LEGALES?",i:"fa-gavel"},{q:"¿EJERCICIO 3X SEMANA?",i:"fa-dumbbell"},{q:"¿INVIERTES CRIPTO?",i:"fa-bitcoin"}]}
        ];

        const SLOT_BRANDS = [{id:'coke',name:'COCA-COLA',icon:'🥤'},{id:'benz',name:'MERCEDES',icon:'🚘'},{id:'mazda',name:'MAZDA',icon:'🏎️'},{id:'mcd',name:'MCDONALDS',icon:'🍔'}];
        const SLOT_QS = [{q:"¿Qué refresco tomas?",a:["Coca-Cola","Pepsi","Agua"]},{q:"¿Tu auto soñado?",a:["Mercedes","Mazda","BMW"]},{q:"¿Comida rápida?",a:["McDonalds","Burger King","KFC"]}];
        const TINDER_DATA = [{t:"¿TU MAYOR MIEDO ES LA SOLEDAD?", i:"https://images.unsplash.com/photo-1501869385787-8d542562419f?w=400"}, {t:"¿EL ÉXITO ES DINERO?", i:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400"}, {t:"¿TE VES VIAJANDO EN 5 A AÑOS?", i:"https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=400"}, {t:"¿TEMES AL FRACASO?", i:"https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=400"}];
