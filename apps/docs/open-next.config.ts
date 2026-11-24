import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// 문서 데이터는 빌드할 때 정해져서 증분 캐시(R2)를 쓰지 않아요.
export default defineCloudflareConfig();
