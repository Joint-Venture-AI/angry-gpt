import config from '../../../config';

export const AuthTemplates = {
  otp: (userName: string, otp: string) => /*html*/ `
  <!DOCTYPE html>
	<html lang="en">
  	<head>
  		<meta charset="UTF-8" />
  		<meta
  			name="viewport"
  			content="width=device-width, initial-scale=1.0"
  		/>
  		<title>${config.server.name} - Password Reset Verification</title>
			<base href="${config.server.href}" />
			<link rel="stylesheet" href="/styles/reset-otp.css" />
  	</head>
  	<body>
  		<div class="container">
  			<div class="card">
  				<div class="header">
  					<img src="/logo.png" class="logo" alt="${config.server.name} Logo" />
  					<h1>Password Reset</h1>
  					<p>Verification Required</p>
  				</div>

  				<div class="content">
  					<div class="greeting">
  						<h2>Hi, ${userName}</h2>
  						<p>
  							We received a request to reset your password. Enter
  							this verification code to continue:
  						</p>
  					</div>

  					<div class="otp-container">
  						<div class="otp-numbers">
  							<span class="otp-number">${otp[0]}</span>
  							<span class="otp-number">${otp[1]}</span>
  							<span class="otp-number">${otp[2]}</span>
  							<span class="otp-number">${otp[3]}</span>
  							<span class="otp-number">${otp[4]}</span>
  							<span class="otp-number">${otp[5]}</span>
  						</div>
  					</div>

  					<div class="info-card time">
  						<div class="info-icon">
  							<span class="icon time"></span>
  						</div>
  						<div class="info-content">
  							<h3>Time Sensitive</h3>
  							<p>
  								This code will expire in 10 minutes for security
  							</p>
  						</div>
  					</div>

  					<div class="info-card security">
  						<div class="info-icon">
  							<span class="icon shield"></span>
  						</div>
  						<div class="info-content">
  							<h3>Security Notice</h3>
  							<p>
  								Never share this code with anyone. Our team will
  								never ask for your verification code.
  							</p>
  						</div>
  					</div>

  					<div class="info-card warning">
  						<div class="info-icon">
  							<span class="icon warning"></span>
  						</div>
  						<div class="info-content">
  							<h3>Didn't Request This?</h3>
  							<p>
  								If you didn't request a password reset, please
  								secure your account immediately
  							</p>
  						</div>
  					</div>
  				</div>

  				<div class="footer">
  					<p>
  						© ${new Date().getFullYear()} ${config.server.name}. All
  						rights reserved.
  					</p>
  					<p>This is an automated message, please do not reply</p>
  				</div>
  			</div>
  		</div>
  	</body>
  </html>`,
};
