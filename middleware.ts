import allowTestUserMiddleware from 'middlewares/allowTestUser';
import rateLimitMiddleware from 'middlewares/rateLimit';
import { stackMiddlewares } from 'middlewares/stackMiddlewares';


export default stackMiddlewares(
  [rateLimitMiddleware],
  [allowTestUserMiddleware]
)
export const config = {
  matcher: ['/:path*']
};
