export const sanitize = str => (str.toLowerCase()
.replace(/[àáâãäå]/ig, 'a')
.replace(/[éèëê]/ig, 'e')
.replace(/[íìïî]/ig, 'i')
.replace(/[óòõöô]/ig, 'o')
.replace(/[uúùüû]/ig, 'u')
.replace(/[ç]/ig, 'c')
.replace(/^[0-9]/ig, '')
.replace(/\s/ig, '-'));
