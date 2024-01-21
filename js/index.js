console.log('index.js import')
//SETUP DU PROJET
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
//TAILLE DE LECRAN OU ON JOUE
canvas.width = 1024
canvas.height = 576

c.imageSmoothingEnabled = false;

//On augement la map en /4 on créer une constance qui nous donne la taille du canvas en fonction de l'echelle qu'on a donner au jeu
const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}

const floorCollisions2D = []

//On met la data des tiles en plusieur array qu'on met dans la liste floorCollisions2D
for (let i = 0 ; i < floorCollisions.length ; i+=36){
        floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}


//Setup matrice des collisions du sol
const floorCollisionsBlocks = []

floorCollisions2D.forEach( (row, y) => {
    row.forEach( (symbol, x) => {
        if(symbol === 202) {
            floorCollisionsBlocks.push(new CollisionBloc({
                position: {
                    x: x * 16,
                    y: y * 16,
                },
            }))
        }
    })
})

//Setup matrice de la collision des plateformes
const paltformCollisionsBlocks2D = []

for (let i = 0; i < platformCollisions.length; i+=36){
    paltformCollisionsBlocks2D.push(platformCollisions.slice(i,i+36))
}

const paltformCollisionsBlocks = []

paltformCollisionsBlocks2D.forEach((row, y) => {
    row.forEach( (symbol, x) => {
        if (symbol === 202){
            paltformCollisionsBlocks.push(new CollisionBloc({
                position: {
                    x: x * 16,
                    y: y * 16,
                },
            }))
        }
    })
})

const gravity = 0.2

//ON REMPLI TOUT LE CANVA EN BLANC
c.fillStyle = 'white'
c.fillRect(0,0, canvas.width ,canvas.height)

const player1 = new Player({
    position: {
        x: 50,
        y: 300, 
    },
    collisionBlocks: floorCollisionsBlocks,
    platformBlocks: paltformCollisionsBlocks,
    imageSrc: '../img/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            src: '../img/warrior/Idle.png',
            frameRate: 8,
        },
        IdleLeft: {
            src: '../img/warrior/IdleLeft.png',
            frameRate: 8,
        },
        Run: {
            src: '../img/warrior/Run.png',
            frameRate: 8,
        },
        RunLeft: {
            src: '../img/warrior/RunLeft.png',
            frameRate: 8,
        },
        Jump: {
            src: '../img/warrior/Jump.png',
            frameRate: 2,
        },
        JumpLeft: {
            src: '../img/warrior/JumpLeft.png',
            frameRate: 2,
        },
    }
})

const keys = {
    d: {
        pressed: false
    },

    q: {
        pressed: false
    },

}

//On créer une sprite pour le fond
const brackground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },

    imageSrc: '../img/background.png'
})

const BackgroundImageHeight = 432

const camera = {
    position: {
        x: 0,
        y: - BackgroundImageHeight + scaledCanvas.height,
    },
}

//Fonction qui s'active pour chaque frame
function animate() {
    window.requestAnimationFrame(animate)
    //On save juste avant de modifier pour pouvoir restore
    c.save()
    //On zoom de 4 pour que la map soit zoomer pour le joueur
    c.scale(4,4)
    //Puis pour qu'on affiche la parti en bas a droite de l'image on déplace l'image d'une distance egale a sa taille et puis on l'augement de la taille du canevas pour arriver tout pile en bas de l'image
    c.translate(camera.position.x, camera.position.y)
    brackground.update()
    //On update le background


    //On affiche les block de collision
    floorCollisionsBlocks.forEach( (col) => {
        col.update()
    })

    paltformCollisionsBlocks.forEach( (col) => {
        col.update()
    })

    //

    player1.update()


    //Si la key est appuyer on avance 
    player1.velocity.x = 0

    if(keys.d.pressed){

         player1.velocity.x = 2

        if(player1.canJump){
            player1.switchSprite('Run')
        }
        else {
            player1.switchSprite('Jump')
        }

        player1.ShouldCameraToRight({canvas , camera})
    }

    else if(keys.q.pressed){
        player1.velocity.x = -2

        if(player1.canJump){
            player1.switchSprite('RunLeft')
        }
        else {
            player1.switchSprite('JumpLeft')
        }

        player1.ShouldCameraToLeft({canvas , camera})
    }

    else {
        if(player1.canJump){
            if(player1.status == 'Run'){

            player1.switchSprite('Idle')
            }
            else{
            
                player1.switchSprite('IdleLeft')
            }
        }

        else {
            if(player1.status == 'Run'){

            player1.switchSprite('Jump')
            }
            else{
            
                player1.switchSprite('JumpLeft')
            }
        }
    }

    if(player1.velocity.y < 0) {
        player1.ShouldCameraToUp({canvas, camera})
    }
    else if(player1.velocity.y > 0) {
        player1.ShouldCameraToDown({canvas, camera})
    }
    //puis on restore
    c.restore()
}

animate()

window.addEventListener('keydown', (event) => {

    switch (event.key) {
        case 'd':
            player1.status = 'Run'
            keys.d.pressed = true
            break
        case 'q':
            player1.status = 'RunLeft'
            keys.q.pressed = true
            break
        case 'z':
            if(player1.canJump)
            player1.velocity.y = -5
            player1.canJump = false
            break
    }
})


window.addEventListener('keyup', (event) => {

    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'q':
            keys.q.pressed = false
            break
    }
})