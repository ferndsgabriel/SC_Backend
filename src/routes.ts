import {Router} from "express"
import multer from "multer";
import uploadMiddlewareInstance from "./Middlewares/FirebaseMiddlwere";

const Multer = multer({
    storage:multer.memoryStorage()
});


// adm import ---------------------------------------------------------------
import { CreateAdmController } from "./Controllers/adm/CreateAdmController";
import { AuthAdmController } from "./Controllers/adm/AuthAdmController";
import { ChangePassAdmControlller } from "./Controllers/adm/ChangePassAdmControlller";
import { DetailsAdmController } from "./Controllers/adm/DetailsAdmController";
import { NewUsersAdmController } from "./Controllers/adm/NewUsersAdmController";
import { ActiveUsersAdmController } from "./Controllers/adm/ActiveUsersAdmController";
import { FilterUsersAdmController } from "./Controllers/adm/FilterUsersAdmController";
import { SetPaymentController } from "./Controllers/adm/SetPaymentController";
import { AutomationPaymentController} from "./Controllers/adm/AutomationPaymentController";
import { CreateaptAdmController } from "./Controllers/adm/CreateaptAdmController";
import { DeleteAccountController } from "./Controllers/adm/DeleteAccountController";
import { CodRecoveyAdmController } from "./Controllers/adm/CodRecoveyAdmController";
import { RecoveryPassAdmController } from "./Controllers/adm/RecoveryPassAdmController";
import { RecoveryEmailAdmController } from "./Controllers/adm/RecoveryEmailAdmController";
import { ChangeAptControler } from "./Controllers/adm/ChangeAptControler";
import { EditAptsAdmController } from "./Controllers/adm/EditAptsAdmController";
import { CreateTowerAdmController } from "./Controllers/adm/CreateTowerAdmController";
import { ListTowersUserController } from "./Controllers/user/ListTowersUserController";
import { DeleteTowerAdmController } from "./Controllers/adm/DeleteTowerAdmController";
import { EditTowerAdmController } from "./Controllers/adm/EditTowerAdmController";
import { DeleteAptAdmController } from "./Controllers/adm/DeleteAptAdmController";
import { ExcelAdmController, upload } from "./Controllers/adm/ExcelAdmController";
// user import ---------------------------------------------------------------
import { ListAptUserController } from "./Controllers/user/ListAptUserController";
import { CreateUserController } from "./Controllers/user/CreateUserController";
import { AuthUserController } from "./Controllers/user/AuthUserController";
import { DetailUserController } from "./Controllers/user/DetailUserController";
import { ChangePassUserController } from "./Controllers/user/ChangePassUserController";
import { ChangePhoneController } from "./Controllers/user/ChangePhoneController";
import { PhotoUserController } from "./Controllers/user/PhotoUserController";
import { DeletePhotoUserController } from "./Controllers/user/DeletePhotoUserController";
import { DeleteAccountUserController } from "./Controllers/user/DeleteAccountUserController";
import {CodRecoveyUserController } from "./Controllers/user/CodRecoveyUserServices";
import { RecoveryPassUserController } from "./Controllers/user/RecoveryPassUserController";
import { RecoveryEmailController } from "./Controllers/user/RecoveryEmailController";
// user import agendamento ---------------------------------------------------------------
import { CreateReservationUserController } from "./Controllers/reservationUser/CreateReservationUserController";
import { DateUnavailableController } from "./Controllers/reservationUser/DateUnavailableController";
import { DeleteReservationUserController } from "./Controllers/reservationUser/DeleteReservationUserController";
import { MyAgendamentosUserController } from "./Controllers/reservationUser/MyAgendamentosUserController";
import { GuestAddController } from "./Controllers/reservationUser/GuestAddController";
import { WaitListUserController } from "./Controllers/reservationUser/WaitListUserController";
// adm import agendamento ---------------------------------------------------------------
import { NewReservationsAdmController } from "./Controllers/reservationAdm/NewReservationsAdmController";
import { SetNewReservationController } from "./Controllers/reservationAdm/SetNewReservationController";
import { ListReservationsTrueController } from "./Controllers/reservationAdm/ListReservationsTrueController";
import { ListAllTaxedAgendamentoController } from "./Controllers/reservationAdm/ListAllTaxedAgendamentoController";
import { ListGuestController } from "./Controllers/reservationAdm/ListGuestController";
import { DeleteReservationAdmController } from "./Controllers/reservationAdm/DeleteReservationAdmController";
//----------------------------------------------------------------------------------//
import { AdmMiddlewares } from "./Middlewares/AdmMiddlewares";
import { UserMiddlewares } from "./Middlewares/UserMiddlewares";


const router = Router();

// routes adm ---------------------------------------------------------------------
router.post ("/adm", new CreateAdmController().handle);
router.post ("/adm/session", new AuthAdmController().handle);
router.post ("/adm/cod", new CodRecoveyAdmController().handle);
router.put("/adm/recovery", new RecoveryPassAdmController().handle);
router.post("/adm/recoveryemail", new RecoveryEmailAdmController().handle);
router.get("/adm/me", AdmMiddlewares, new DetailsAdmController().handle );
router.put('/adm/pass', AdmMiddlewares, new ChangePassAdmControlller().handle);
router.get("/adm/users",AdmMiddlewares, new NewUsersAdmController().handle );
router.put("/adm/useron", AdmMiddlewares, new ActiveUsersAdmController().handle);
router.get("/adm/filter", AdmMiddlewares, new FilterUsersAdmController().handle);
router.put ("/adm/setpayment", AdmMiddlewares, new SetPaymentController().handle);
router.post ("/adm/apt", AdmMiddlewares, new CreateaptAdmController().handle);
router.delete ("/adm/apt", AdmMiddlewares, new DeleteAptAdmController().handle);
router.put ("/adm/apt", AdmMiddlewares, new  EditAptsAdmController().handle);
router.put ("/adm/aptuser", AdmMiddlewares, new ChangeAptControler().handle);
router.put ("/adm/automation", AdmMiddlewares, new AutomationPaymentController().handle);
router.delete ("/adm/account", AdmMiddlewares, new DeleteAccountController().handle);
router.post ("/adm/towers", AdmMiddlewares, new  CreateTowerAdmController().handle);
router.delete ("/adm/towers", AdmMiddlewares, new DeleteTowerAdmController().handle);
router.put ("/adm/towers", AdmMiddlewares, new EditTowerAdmController().handle);
router.post("/adm/excel",  upload.single('excel'), new ExcelAdmController().handle);
// routes user ---------------------------------------------------------------------
router.get ("/towers", new ListTowersUserController().handle);
router.get("/apts", new ListAptUserController().handle);
router.post ("/user", new CreateUserController().handle);
router.post ("/session", new AuthUserController().handle);
router.post("/cod", new CodRecoveyUserController().handle);
router.put("/recovery", new RecoveryPassUserController().handle);
router.post("/recoveryemail", new RecoveryEmailController().handle);
router.get("/me", UserMiddlewares, new DetailUserController().handle );
router.put("/password", UserMiddlewares, new ChangePassUserController().handle);
router.put("/photo", UserMiddlewares, Multer.single('image'), uploadMiddlewareInstance, new PhotoUserController().handle);
router.put('/phone', UserMiddlewares, new ChangePhoneController().handle);
router.put('/photodelete', UserMiddlewares, new DeletePhotoUserController().handle);
router.delete('/account', UserMiddlewares, new DeleteAccountUserController().handle);
// routes user agendamento ---------------------------------------------------------------------
router.post("/reservations", UserMiddlewares, new CreateReservationUserController().handle);
router.get("/allreservations", UserMiddlewares, new DateUnavailableController().handle);
router.delete("/reservations", UserMiddlewares, new DeleteReservationUserController().handle);
router.get("/myreservations", UserMiddlewares, new MyAgendamentosUserController().handle);
router.put("/guest", UserMiddlewares, new GuestAddController().handle);
router.post("/list", UserMiddlewares, new WaitListUserController().handle);
// routes adm agendamento ---------------------------------------------------------------------
router.get("/adm/reservations", AdmMiddlewares, new NewReservationsAdmController().handle);
router.put("/adm/setreservations", AdmMiddlewares, new SetNewReservationController().handle);
router.get("/adm/actreservations", AdmMiddlewares, new ListReservationsTrueController().handle);
router.get("/adm/taxed", AdmMiddlewares, new ListAllTaxedAgendamentoController().handle);
router.post("/adm/guets", AdmMiddlewares, new ListGuestController().handle);
router.delete("/adm/reservation", AdmMiddlewares, new DeleteReservationAdmController().handle);

export {router}