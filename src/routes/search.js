const KoaRouter = require('koa-router');
var Op = require('sequelize').Op;
const router = new KoaRouter();

router.get('/', async (ctx) => {
    console.log(ctx.query);
    new_dict = {
        amount: 0,
        data: {
            "Universidades": [

            ],
            "Carreras": [
                
            ]
        }
    }
    let text = ctx.query['text'];
    if (ctx.query['text'] == undefined ) {
        text = "";
    }
    const universities = await ctx.orm.university.findAll({ 
        where: {
            name: {
                [Op.iLike]: `%${text}%`
            }
        }
    });
    new_dict["amount"] += universities.length;
    new_dict["data"]['Universidades'] = universities;
    const careers = await ctx.orm.career.findAll({ 
        where: {
            name: {
                [Op.iLike]: `%${text}%`
            }
        }
    });
    new_dict["amount"] += careers.length;
    new_dict["data"]['Carreras'] = careers;
    switch (ctx.accepts(['json', 'html'])) {
        case 'json':
            ctx.statusCode = 200;
            ctx.body = new_dict;
            break;
        case 'html':
            await ctx.render('search', {
                results: new_dict,
            });
        default:
            break
    }
});

module.exports = router;
