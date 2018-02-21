console.log('Sw')
const cacheName= 'veille-techno-1.0'
// Pour faire réference au SW on fait self
// Ne pas oublier de Unregistrer le SW si on voit pas les console
// Savoir si le SW est installer
self.addEventListener('install',evt=>{
    console.log(evt)
    // Au moment ou le cache est installer
    caches.open(cacheName).then(cache=>{
        cache.addAll([
            'index.html',
            'database.js',
            'main.js',
            'style.css',
            'vendors/bootstrap4.min.css',
            'add_techno.html',
            'add_techno.js',
            'contact.html',
            'contact.js',
        ])
    })
})
// Savoir si le SW est activé
self.addEventListener('activate',evt=>{
    console.log('activate evt',evt)
})

self.addEventListener('fetch',evt=>{
    // Tester si le navigateur est Hors ligne
    if(!navigator.onLine){
        const headers = {headers:{'Content-Type':'text/html;charset=utf-8'}}
        // Permet de creer une nouvelle réponse à la place de celle qu'on renvoie
        evt.respondWith(new Response('<h1>Pas de connexion internet</h1><div>Application en mode dégradé. Veuillez vous connectez</div>',headers))
    }
    // console.log('fetch event sur url ',evt.request.url)
     // Methode cache only with network fallback
     // Si y a pas ce qu'on recherche dans le cache
    evt.respondWith(
        // On va chercher si dans le cache il y a quelque chose qui est egale a la reponse
        caches.match(evt.request).then(res=>{
            console.log('url fetchée '+evt.request.url,res)
            if(res){
                // Sil existe alors afficher le fichier du cache
                console.log('url fetchée depuis le cache '+evt.request.url,res)
                return res
            }
            // Sil n a rien alors faire une requete
            return fetch(evt.request).then(newResponse =>{
                console.log('url récupérer sur le reseau puis mise en cache '+evt.request.url,newResponse)
                // Une fois la page recuperer la stocker dans le cache
                caches.open(cacheName).then(cache=>cache.put(evt.request,newResponse))
                // ON clone la reponse car on ne peut pas utiliser une reponse deux fois
                return newResponse.clone()
            })
        })
    )
})