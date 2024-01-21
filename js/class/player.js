console.log('player.js import')

//Cration joueur
class Player extends Sprite {
    constructor({position, collisionBlocks, platformBlocks, imageSrc, frameRate, scale = 0.5, animations}) {
        super({imageSrc, frameRate, scale})
        this.position = position
        this.velocity = {
            x: 0,
            y: 1,
        }

        this.collisionBlocks = collisionBlocks
        this.platformBlocks = platformBlocks

        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 10,
            height: 10
        }

        this.animations = animations

        for (let key in this.animations){ // POUR CHAQUE ELEMENT DANS ANIMATION
            const image = new Image()
            image.src = this.animations[key].src // ON CREER UNE NOUVELLE IMAGE AVEC LA SOURCE DE LIMAGE DE LA SECTION

            this.animations[key].image = image // PUIS POUR CETTE SECTION ON AJOUTE UNE VARARAIBLE IMAGE AVEC L'IMAGE JAVASCRIPT
        }

        this.camerabox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },

            width: 200,
            height: 80
        }

        this.canJump = false
        this.status = 'none'
    }

    ShouldCameraToLeft({canvas, camera}) {
        const cameraboxLeft = this.camerabox.position.x
        const scaledDownCanvasWidth = canvas.width / 4//car on a zoomer de x4

        if(cameraboxLeft + this.velocity.x < 0){
            return 
        }

        if(cameraboxLeft <= 0 + Math.abs(camera.position.x)){ //car on a zoomer de x4
            console.log('translate to the left')
            camera.position.x-= this.velocity.x
        }
    }

    ShouldCameraToRight({canvas, camera}) {
        const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
        const scaledDownCanvasWidth = canvas.width / 4//car on a zoomer de x4

        if(cameraboxRightSide + this.velocity.x > 576){
            return 
        }

        if(cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)){
            console.log('translate to the right')
            camera.position.x-= this.velocity.x
        }
    }

    ShouldCameraToUp({canvas, camera}) {

        if(this.camerabox.position.y + this.velocity.y <= 0){
            return
        }

        if(this.camerabox.position.y <= Math.abs(camera.position.y)){
            console.log('translate to the up')
            camera.position.y-= this.velocity.y
        }
    }

    ShouldCameraToDown({canvas, camera}) {

        if(this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaledCanvas.height){ //car on a zoomer de x4
            console.log('translate to the down')
            camera.position.y-= this.velocity.y
        }
    }

    update() {

        this.updateFrames()
        this.updateHitbox()
        this.updateCameraBox()

        //DRAW THE CAMERA
        c.fillStyle = 'rgba(0, 0, 255,0.25)'
        c.fillRect(this.camerabox.position.x , this.camerabox.position.y, this.camerabox.width , this.camerabox.height)

        //DRAW THE HITBOX AND IMAGE

        //IMAGE BOX
        c.fillStyle = 'rgba(0, 255 ,0 ,0.25)'
        c.fillRect(this.position.x , this.position.y, this.width , this.height)

        //HIT BOX
        //c.fillStyle = 'rgba(255, 0, 0,0.25)'
        //c.fillRect(this.hitbox.position.x , this.hitbox.position.y, this.hitbox.width , this.hitbox.height)

        // DRAW IMAGE
        this.draw()

        this.position.x += this.velocity.x

        //LE SENS OU ON VERIFIE LES COLLISION EST TRES IMPORTANT IL FAUT FAIRE ATTENTION A NE PAS LE CHANGER 
        // Horizontal -> Gravité -> Vertical (SI ON FAIT PAS IL YA DES GROS BUGS)
        this.updateHitbox()
        this.checkForHorizontalCollisions()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollisions()
    }

    updateCameraBox() {
        this.camerabox = {
            position: {
                x: this.position.x - 50,
                y: this.position.y,
            },

            width: 200,
            height: 80
        }
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 33, //CES 2 VALEURS SONT LA POSTION DE LA HITBOX PAR RAPPORT A L'IMAGE
                y: this.position.y + 25,
            },
            width: 15,
            height: 27.8
        }
    }

    applyGravity() {
        this.position.y += this.velocity.y
        this.velocity.y +=  gravity
    }


    //ON DOIT TOUJOURS REGARDER D'ABORD LES COLLISION HORIZONTALE PUIS APRES ON CHECK LES COLLISION VERTICALE
    checkForHorizontalCollisions(){
        for (let i = 0 ; i < this.collisionBlocks.length ; i++){

            if(this.position.x + this.width - 33 - this.hitbox.width < 0) {
                this.position.x = -33
            }

            // IL MANQUE DE FAIRE LA BORDURE DROITE

            const ColBlock = this.collisionBlocks[i]

            if ( collision({
                object1: this.hitbox,
                object2: ColBlock,
                })
            ) {
                if (this.velocity.x < 0){
                    this.velocity.x = 0

                    const offset = 33 - ColBlock.width

                    this.position.x = ColBlock.position.x - offset + 0.01
                }
                if (this.velocity.x > 0){
                    this.velocity.x = 0

                    const offset = 33 + this.hitbox.width

                    this.position.x = ColBlock.position.x - offset - 0.01
                }
            }
        }
    }

    checkForVerticalCollisions(){
        for (let i = 0 ; i < this.collisionBlocks.length ; i++){

            const ColBlock = this.collisionBlocks[i]

            if ( collision({
                object1: this.hitbox,
                object2: ColBlock,
                })
            ) {
                if (this.velocity.y > 0){
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = ColBlock.position.y - offset - 0.01
                    this.canJump = true
                    break
                }

                if (this.velocity.y < 0){
                    this.velocity.y = 0

                    const offset = 25 - ColBlock.height

                    this.position.y = ColBlock.position.y - offset + 0.01
                }
            }
        }

        for (let i = 0 ; i < this.platformBlocks.length ; i++){
            const ColBlock = this.platformBlocks[i]

            if( collision({
                object1: this.hitbox,
                object2: ColBlock,
                })
            ) {
                if(this.velocity.y > 0 && ColBlock.position.y >= this.hitbox.position.y + this.hitbox.height - this.velocity.y){
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = ColBlock.position.y - offset - 0.01
                    this.canJump = true
                }
            }
        }
    }
}