import type { HttpException } from '@nestjs/common';
import type { Request } from 'express';

export class Result {
  /**
   * 响应码
   */
  public code = 0;
  /**
   * 响应消息
   */
  public message = 'OK';
  /**
   * 是否成功
   */
  public success = true;
  /**
   * 会话序号
   */
  public session = '';
  /**
   * 响应数据
   */
  public resource: any = null;
  /**
   * 签名
   */
  public sign = '';
  /**
   * 其他数据
   */
  public other: any = null;

  /**
   *
   * @param resource
   * @param exception
   */
  public constructor(resource: any, exception?: HttpException) {
    this.resource = resource;

    // 如果是 错误类型 的 Result
    if (exception) {
      const response = exception.getResponse();
      this.resource = response !== exception.message ? response : null;
      this.code = exception.getStatus();
      this.message = exception.message;
      this.success = false;
    }
  }

  /**
   * 根据 Http Request 更新 Result
   * @param request
   */
  public update(request: Request) {
    if (typeof request.body === 'object' && request.body.session) {
      this.session = request.body.session;
    }
  }
}
