export class GithubUser {
    static search(userId) {
        const dateUser = `https://api.github.com/users/${userId}`
        return fetch(dateUser).then(data => data.json()).then( ({login, name, public_repos, followers}) => ({login,name, public_repos, followers}))          
    }
}
