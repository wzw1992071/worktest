
export default {
    goRouter(url,router,param={}){
        router.push({ path:url,query:param })
    }
}