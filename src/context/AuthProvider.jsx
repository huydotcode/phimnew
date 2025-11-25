import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { auth, db } from "../app/firebase"; // đường dẫn tới firebase.js của bạn

const AuthContext = createContext();
const provider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // chờ load firebase

  useEffect(() => {
    // Kiểm tra trạng thái xác thực người dùng
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(true); // Bắt đầu load


      if (currentUser) {
        // Kiểm tra localStorage trước
        const cachedUser = localStorage.getItem(`user_${currentUser.uid}`);
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
          setLoading(false);
          return;
        }

        // Query từ firebase
        const userDocRef = doc(db, "users", currentUser.uid);

        if (userDocRef) {
          getDoc(userDocRef).then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              setUser({
                displayName: userData.displayName,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                photoURL: userData.photoURL,
                uid: currentUser.uid,
                role: userData.role,
                createdAt: userData.createdAt,
              });

              localStorage.setItem(
                `user_${currentUser.uid}`,
                JSON.stringify({
                  displayName: userData.displayName,
                  email: userData.email,
                  phoneNumber: userData.phoneNumber,
                  photoURL: userData.photoURL,
                  uid: currentUser.uid,
                  role: userData.role,
                  createdAt: userData.createdAt,
                }),
              )
            } else {
              setUser(null);
              localStorage.removeItem(`user_${currentUser.uid}`);
            }
          });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Đăng nhập
  const loginWithEmailPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (userCredential) {
        const { uid, displayName, email, photoURL, phoneNumber } =
          userCredential.user;

        // Kiểm tra xem đã lưu thông tin bổ sung trong Firestore chưa
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Nếu đã lưu thông tin người dùng trong Firestore, lấy thêm dữ liệu từ Firestore
          const userData = userDoc.data();

          // Cập nhật thêm thông tin vào state nếu cần
          setUser({
            uid,
            displayName: displayName || userData.displayName,
            email,
            photoURL: photoURL || userData.photoURL,
            phoneNumber: phoneNumber || userData.phoneNumber,
            createdAt: userData.createdAt,
            role: userData.role,
          });

          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem(
            `user_${uid}`,
            JSON.stringify({
              uid,
              displayName: displayName || userData.displayName,
              email,
              photoURL: photoURL || userData.photoURL,
              phoneNumber: phoneNumber || userData.phoneNumber,
              createdAt: userData.createdAt,
              role: userData.role,
            }),
          );
        } else {
          setUser({
            uid,
            displayName,
            email,
            photoURL,
            phoneNumber,
          });
          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem(
            `user_${uid}`,
            JSON.stringify({
              uid,
              displayName,
              email,
              photoURL,
              phoneNumber,
            }),
          );

        }
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      throw new Error("Đăng nhập thất bại!");
    }
  };

  // Đăng ký
  const register = async ({
    email,
    password,
    displayName,
    phoneNumber,
    photoURL,
  }) => {
    try {
      // Truy vấn vào Firestore để kiểm tra email đã tồn tại chưa
      const usersCollection = collection(db, "users");
      const qEmail = query(usersCollection, where("email", "==", email));
      const querySnapshotEmail = await getDocs(qEmail);

      const qPhone = query(
        usersCollection,
        where("phoneNumber", "==", phoneNumber),
      );
      const querySnapshotPhone = await getDocs(qPhone);

      if (!querySnapshotEmail.empty) {
        // Nếu có tài liệu trùng khớp với email, thông báo cho người dùng
        toast.error("Email này đã được đăng ký!");
        return false;
      }

      if (!querySnapshotPhone.empty) {
        // Nếu có tài liệu trùng khớp với email, thông báo cho người dùng
        toast.error("Số điện thoại này đã được đăng ký!");
        return false;
      }

      // Nếu email chưa được đăng ký, thực hiện đăng ký
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const currentUser = userCredential.user;

      // Lưu thông tin người dùng vào Firestore
      if (currentUser) {
        const { uid, email } = currentUser;
        await setDoc(doc(db, "users", uid), {
          uid,
          displayName,
          email,
          phoneNumber,
          photoURL: photoURL || "", // Nếu không có photoURL thì để trống
          createdAt: new Date(), // Lưu thời gian tạo tài khoản
          role: "user", // Mặc định là user, có thể thay đổi sau này
        });

        // Lưu thông tin người dùng vào state (nếu có)
        setUser({
          uid,
          displayName,
          email,
          phoneNumber,
          photoURL,
          role: "user",
        });
      }

      return true;
    } catch (error) {
      console.error("Error registering: ", error);

      return false;
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Đặt lại state user về null sau khi đăng xuất
      localStorage.removeItem(`user_${user.uid}`); // Xóa thông tin người dùng khỏi localStorage
      toast("Đăng xuất thành công!");
    } catch (error) {
      console.error("Error signing out: ", error);
      toast("Đăng xuất thất bại!");
    }
  };

  // Đăng nhập với Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Lấy thông tin người dùng từ Firebase Authentication
      const { uid, displayName, email, photoURL, phoneNumber } = user;

      const userRef = doc(db, "users", uid); // Tạo document với UID của người dùng

      // Kiểm tra xem người dùng đã tồn tại trong Firestore chưa
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        // Nếu người dùng đã tồn tại, không cần tạo mới



      } else {
        // Nếu người dùng chưa tồn tại, tạo mới

        await setDoc(
          userRef,
          {
            uid,
            displayName,
            email,
            photoURL,
            phoneNumber,
            createdAt: new Date(), // Thêm thời gian tạo người dùng
            role: "user", // Mặc định là user, có thể thay đổi sau này
          },
          {
            merge: true,
          },
        );
      }



    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast.error("Đăng nhập bằng Google thất bại");
    }
  };

  const forgotPassword = async (email) => {
    try {
      if (!email) {
        toast.error("Vui lòng nhập email trước khi reset mật khẩu!");
        return;
      }

      await sendPasswordResetEmail(auth, email);
      toast.success("Email đặt lại mật khẩu đã được gửi!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể gửi email đặt lại mật khẩu!");
    }
  };

  useEffect(() => {
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmailPassword,
        register,
        logout,
        loginWithGoogle,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
