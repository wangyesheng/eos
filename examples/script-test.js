const depsMap = new Map();
depsMap.set('name', () => console.log('name'));
depsMap.set('age', () => console.log('age'));
depsMap.set('gender', () => console.log('gender'));

depsMap.forEach((fn,key,receiver) => {
    fn()
});
