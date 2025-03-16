"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
exports.swaggerConfig = new swagger_1.DocumentBuilder()
    .setTitle('Job Board API')
    .setDescription('API for job offers from multiple providers')
    .setVersion('1.0')
    .addTag('jobs')
    .addBearerAuth()
    .build();
//# sourceMappingURL=swagger.config.js.map