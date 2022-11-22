import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // AngularFireAuth is for observable of data input and to monitor applications Authentication
  constructor(private fireAuth: AngularFireAuth, private router: Router) {}

  //Login Method
  // To Authenticate Login of Email and Password using Angular Firestore Authentication
  login(email: string, password: string) {
    // using Angular Fire auth to the function Sign in with Email
    this.fireAuth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        // to authenticate account using token if exist
        localStorage.setItem('token', 'true');

        // if router is succesfull it will navigate through the dashboard
        if (res.user?.emailVerified == true) {
          this.router.navigate(['/dashboard']);
        }
        // else again verify email
        else {
          this.router.navigate(['/verify-email']);
        }
      },
      // if false of error console alert something went wrong
      (err) => {
        alert(err.message);
        alert('Something Went Wrong');
        this.router.navigate(['/login']);
      }
    );
  }

  // Register Method
  // Registering account using Fireauth function createUserWithEmailAndPassword
  register(email: string, password: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        // if registration is succesful console alert 'Registration Succesful'
        // then navigate to the router login
        alert('Registration Succesful');
        this.sendEmailForVerification(res.user);
        if (res.user?.emailVerified == true) {
          res.user.reload().then(() => {
            alert('Authentication Succesful');
            this.router.navigate(['/login']);
          });
          this.router.navigate(['/login']);
          // else verify email
        } else {
          this.router.navigate(['verify-email']);
        }
        // Creating parameter Res for user to have OTTP Verification
        // this.router.navigate(['/login']);
        // setting the res parameter to the sendEmaiForVerification to

        // this.sendEmailForVerification(res.user);
      },

      // if false of error console alert something went wrong
      // then navigate again the register
      (err) => {
        alert(err.message);
        alert('Account Already Exist');
        this.router.navigate(['/register']);
      }
    );
  }

  // Sign out Method
  logout() {
    // using Angular Fire auth to for relation database logout
    this.fireAuth.signOut().then(
      () => {
        // if Signout was clicked the token will be remove
        localStorage.removeItem('token');
        // Will naviage again to login
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
      }
    );
  }
  // Forgot Password Method
  forgotPassword(email: string) {
    // using Fireaut method to autheticate in the relational database
    // then using sendpasswordRestEmail to email.
    this.fireAuth.sendPasswordResetEmail(email).then(
      () => {
        // then it will naviage to verification email.
        this.router.navigate(['/verify-email']);
      },
      (err) => {
        alert('Something Went Wrong');
      }
    );
  }

  // Email Verification
  sendEmailForVerification(user: any) {
    this.fireAuth.currentUser

      .then((user) => {
        return user?.sendEmailVerification();
      })
      .then(
        () => {
          this.router.navigate(['verify-email']);
        },
        (err) => {
          alert('Something Went Wrong. Not able to send mail to your Email');
        }
      );
  }
}
