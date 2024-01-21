console.log('sprite.js import')

//Un sprite a une position une image et le lien de l'image
class Sprite {
    constructor({position, imageSrc, frameRate = 1, scale = 1}) { // QUAND ON MET = 1 C'EST QU'ON MET PAR DEFAULT 1 A CETTE VALEUR
        this.position = position
        this.scale = scale
        this.image = new Image()
        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate) * this.scale
            this.height = (this.image.height) * this.scale
        }

        this.image.src = imageSrc
        this.frameRate = frameRate
        this.currentFrame = 0
        this.frameBuffer = 5 // CE QUI FAIT QUE TOUTE LES 3 ON MET LA PROCHAINE IMAGE DE L'ANIMTION DU SPRITE
        this.elapsedFrames = 0
    }

    draw() {

        //si image n'existe pas on fait rien
        if(!this.image) {
            return
        }

        const cropbox = {
            position: {
                x: this.currentFrame * (this.image.width/ this.frameRate),
                y: 0,
            },
            width: this.image.width / this.frameRate, // CAR IL YA 8 IMAGE DIFFERENTE
            height: this.image.height,
        }

        // ICI ON ESSSAYE DE ROGNER L'IMAGE
        c.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            )
    }

    switchSprite(key){
        this.image = this.animations[key].image
        this.frameRate = this.animations[key].frameRate
    }

    update() {
        this.draw()
    }

    updateFrames() {
        this.elapsedFrames++ //CHAQUE FRAME ON RAJOUTE UN 1

        if(this.elapsedFrames % this.frameBuffer === 0){ // SI LE NOMBRE DE FRAME PASSER EST A UN MULTIPLE DE 3 ALORS ON FAIT LANIMATION DONC TOUTE LES 3 IMAGE
            if(this.currentFrame < this.frameRate - 1){
            this.currentFrame++
            }
            else {
                this.currentFrame = 0
            }
        }
    }
}
