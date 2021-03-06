const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('session.new', '/signin', async (ctx) => {
  return ctx.render('session/new', {
    createSessionPath: ctx.router.url('session.create'),
    createUserPath: ctx.router.url('users.new'),
    notice: ctx.flashMessage.notice,
  });
});

router.put('session.create', '/signin', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.find({ where: { email } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    ctx.session.userId = user.id;
    // ctx.session.userType = "student"; // podemos usar esto
    return ctx.redirect(ctx.router.url('universities.list'));
  }
  return ctx.render('session/new', {
    email,
    createUserPath: ctx.router.url('users.new'),
    createSessionPath: ctx.router.url('session.create'),
    error: 'Incorrect mail or password',
  });
});

router.delete('session.destroy', '/signout', (ctx) => {
  ctx.session = null;
  console.log("Se cierra sesión");
  ctx.redirect("/");
});

module.exports = router;
