import User from '../user/User.model';
import bcrypt from 'bcrypt';
import { createToken, generateOtp, verifyToken } from './Auth.utils';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../../errors/ServerError';
import { sendEmail } from '../../../util/sendMail';
import { AuthTemplates } from './Auth.template';
import { Types } from 'mongoose';
import config from '../../../config';
import { EUserStatus } from '../user/User.enum';

export const AuthServices = {
  async login({ email, password }: Record<string, string>) {
    const user = await User.findOne({
      email,
    }).select('+password');

    if (!user)
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        "Email or password don't match!",
      );

    if (user.status !== EUserStatus.ACTIVE) {
      const otp = generateOtp();

      user.otp = otp;
      user.otpExp = new Date(Date.now() + 10 * 60 * 1000 * 1000);

      await user.save();

      await sendEmail({
        to: email,
        subject: `Your ${config.server.name} account activation OTP is ${otp}.`,
        html: AuthTemplates.activate_otp(user.name, otp.toString()),
      });

      throw new ServerError(
        StatusCodes.ACCEPTED,
        'OTP sent to your email. Please verify your account.',
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        "Email or password don't match!",
      );

    const userData = await User.findById(user._id)
      .select('name avatar email role')
      .lean();

    const accessToken = createToken({ email }, 'access');

    const refreshToken = createToken({ email }, 'refresh');

    return { accessToken, user: userData, refreshToken };
  },

  async changePassword(
    id: Types.ObjectId,
    { newPassword, oldPassword }: Record<string, string>,
  ) {
    const user = (await User.findById(id).select('+password'))!;

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword)
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        "Email or password don't match!",
      );

    user.password = newPassword;

    await user.save();
  },

  async sendOtp(email: string) {
    const user = await User.findOne({ email });

    if (!user)
      throw new ServerError(
        StatusCodes.NOT_FOUND,
        'User not found. Check your email and try again.',
      );

    const otp = generateOtp();

    user.otp = otp;
    user.otpExp = new Date(Date.now() + 10 * 60 * 1000 * 1000);

    await user.save();

    await sendEmail({
      to: email,
      subject: `Your ${config.server.name} password reset OTP is ${otp}.`,
      html: AuthTemplates.reset_otp(user.name, otp.toString()),
    });
  },

  async verifyOtp(email: string, otp: number) {
    const user = await User.findOne({ email });

    if (!user)
      throw new ServerError(
        StatusCodes.NOT_FOUND,
        'User not found. Check your email and try again.',
      );

    if (user.otpExp && new Date(user.otpExp) < new Date())
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'The OTP has expired. Please request a new one.',
      );

    if (user.otp !== otp)
      throw new ServerError(
        StatusCodes.UNAUTHORIZED,
        'The OTP you entered is incorrect or expired. Please check your email and try again.',
      );

    if (user.status !== EUserStatus.ACTIVE) user.status = EUserStatus.ACTIVE;

    /** otp = one time password; Be careful */
    user.otp = undefined;
    user.otpExp = undefined;

    await user.save();

    const userData = await User.findById(user._id)
      .select('name avatar email role')
      .lean();

    const accessToken = createToken({ email: user.email }, 'access');

    const refreshToken = createToken({ email }, 'refresh');

    return { accessToken, refreshToken, user: userData };
  },

  async resetPassword(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user)
      throw new ServerError(
        StatusCodes.NOT_FOUND,
        'User not found. Try again later.',
      );

    user.password = password;
    await user.save();
  },

  async refreshToken(token: string) {
    if (!token)
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'You are not logged in!');

    const { email } = verifyToken(token.split(' ')[0], 'refresh');

    const user = await User.findOne({
      email,
    });

    if (!user) throw new ServerError(StatusCodes.NOT_FOUND, 'User not found!');

    const accessToken = createToken({ email }, 'access');

    return { accessToken };
  },
};
