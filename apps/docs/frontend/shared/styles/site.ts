/* 설치된 Button CSS가 공통 토큰도 연결해요. 별도 토큰 import로 중복 번들하지 않아요.
 * Button 자체도 같은 CSS 모듈을 import하므로 웹사이트와 Story에서 한 번만 로드돼요.
 */
import '../ui/button/Button.css';
import './site.css';
