
export class UserFav {
    constructor(source){
        this.source = document.querySelector(source)
        this.load()
    }

    load(){
        this.users = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.users))
    }
    
    async add(value){
        try {          
            if(value==''){
                throw new Error('Por favor preencha o campo!')
            } else {
                if(this.users === undefined){
                    const user = await this.search(value)
                    this.userCheck(user)
                } else {
                    const userExists = this.users.find(user => user.login === value)
                    if (userExists){
                        throw new Error('Usuário já cadastrado!')
                    } else {
                        const user = await this.search(value)
                        this.userCheck(user)
                    }
                }
            }
        } catch(error){
            alert(error.message)
        }

    }

    search(userId) {
        const dateUser = `https://api.github.com/users/${userId}`
        return fetch(dateUser).then(data => data.json()).then( ({login, name, public_repos, followers}) => ({login,name, public_repos, followers}))          
    }

}

export class UserFavDisplay extends UserFav {
    constructor(source) {
        super(source)

        this.tbody = this.source.querySelector('table tbody')
        this.tEmpty = this.source.querySelector('.table-empty')

        this.update()
        this.tableEmpty()
        this.inputSearch()
    }

    update(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {tr.remove()})
        this.users.forEach( user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            
            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if (isOk){
                    this.delete(user)
                }
            }
            this.tbody.append(row)
        })
        this.tableEmpty()
        this.save()
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="Imagem de mayk">
                <a href="https://github.com/maykbrito" target="_blank">
                    <p>Mayk Brito</p>
                    <span>maykbrito</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>`
            
        return tr

    }

    inputSearch(){
        const searchButton = this.source.querySelector('.search button')
        searchButton.onclick = () => {
            const {value} = this.source.querySelector('.search input')
            this.add(value)
        }
    }

    delete(user){
        const filteredUsers = this.users.filter(entry => entry.login !== user.login)

        this.users = filteredUsers
        
        this.tableEmpty()
        this.update()
        this.save()
    }

    userCheck(user){
        if(user.login===undefined){
            alert('Usuário não encontrado!')
        } else {
            this.users = [user, ...this.users]
            this.update()
        }
    }

    tableEmpty(){
        if(this.users.length == 0){
            this.tEmpty.classList.remove('hidden')
        } else {
            this.tEmpty.classList.add('hidden')
        }
    }
}