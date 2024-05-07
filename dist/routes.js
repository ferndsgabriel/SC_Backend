"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const FirebaseMiddlwere_1 = __importDefault(require("./Middlewares/FirebaseMiddlwere"));
const Multer = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage()
});
// adm import ---------------------------------------------------------------
const CreateAdmController_1 = require("./Controllers/adm/CreateAdmController");
const AuthAdmController_1 = require("./Controllers/adm/AuthAdmController");
const ChangePassAdmControlller_1 = require("./Controllers/adm/ChangePassAdmControlller");
const DetailsAdmController_1 = require("./Controllers/adm/DetailsAdmController");
const NewUsersAdmController_1 = require("./Controllers/adm/NewUsersAdmController");
const ActiveUsersAdmController_1 = require("./Controllers/adm/ActiveUsersAdmController");
const FilterUsersAdmController_1 = require("./Controllers/adm/FilterUsersAdmController");
const SetPaymentController_1 = require("./Controllers/adm/SetPaymentController");
const AutomationPaymentController_1 = require("./Controllers/adm/AutomationPaymentController");
const CreateaptAdmController_1 = require("./Controllers/adm/CreateaptAdmController");
const DeleteAccountController_1 = require("./Controllers/adm/DeleteAccountController");
const CodRecoveyAdmController_1 = require("./Controllers/adm/CodRecoveyAdmController");
const RecoveryPassAdmController_1 = require("./Controllers/adm/RecoveryPassAdmController");
const ChangeAptControler_1 = require("./Controllers/adm/ChangeAptControler");
const EditAptsAdmController_1 = require("./Controllers/adm/EditAptsAdmController");
const CreateTowerAdmController_1 = require("./Controllers/adm/CreateTowerAdmController");
const ListTowersUserController_1 = require("./Controllers/user/ListTowersUserController");
const DeleteTowerAdmController_1 = require("./Controllers/adm/DeleteTowerAdmController");
const EditTowerAdmController_1 = require("./Controllers/adm/EditTowerAdmController");
const DeleteAptAdmController_1 = require("./Controllers/adm/DeleteAptAdmController");
const ExcelAdmController_1 = require("./Controllers/adm/ExcelAdmController");
// user import ---------------------------------------------------------------
const ListAptUserController_1 = require("./Controllers/user/ListAptUserController");
const CreateUserController_1 = require("./Controllers/user/CreateUserController");
const AuthUserController_1 = require("./Controllers/user/AuthUserController");
const DetailUserController_1 = require("./Controllers/user/DetailUserController");
const ChangePassUserController_1 = require("./Controllers/user/ChangePassUserController");
const PhotoUserController_1 = require("./Controllers/user/PhotoUserController");
const DeletePhotoUserController_1 = require("./Controllers/user/DeletePhotoUserController");
const DeleteAccountUserController_1 = require("./Controllers/user/DeleteAccountUserController");
const CodRecoveyUserServices_1 = require("./Controllers/user/CodRecoveyUserServices");
const RecoveryPassUserController_1 = require("./Controllers/user/RecoveryPassUserController");
// user import agendamento ---------------------------------------------------------------
const CreateReservationUserController_1 = require("./Controllers/reservationUser/CreateReservationUserController");
const DateUnavailableController_1 = require("./Controllers/reservationUser/DateUnavailableController");
const DeleteReservationUserController_1 = require("./Controllers/reservationUser/DeleteReservationUserController");
const MyAgendamentosUserController_1 = require("./Controllers/reservationUser/MyAgendamentosUserController");
const GuestAddController_1 = require("./Controllers/reservationUser/GuestAddController");
const WaitListUserController_1 = require("./Controllers/reservationUser/WaitListUserController");
// adm import agendamento ---------------------------------------------------------------
const NewReservationsAdmController_1 = require("./Controllers/reservationAdm/NewReservationsAdmController");
const SetNewReservationController_1 = require("./Controllers/reservationAdm/SetNewReservationController");
const ListReservationsTrueController_1 = require("./Controllers/reservationAdm/ListReservationsTrueController");
const ListAllTaxedAgendamentoController_1 = require("./Controllers/reservationAdm/ListAllTaxedAgendamentoController");
const ListGuestController_1 = require("./Controllers/reservationAdm/ListGuestController");
const DeleteReservationAdmController_1 = require("./Controllers/reservationAdm/DeleteReservationAdmController");
//----------------------------------------------------------------------------------//
const AdmMiddlewares_1 = require("./Middlewares/AdmMiddlewares");
const UserMiddlewares_1 = require("./Middlewares/UserMiddlewares");
const router = (0, express_1.Router)();
exports.router = router;
// routes adm ---------------------------------------------------------------------
router.post("/adm", new CreateAdmController_1.CreateAdmController().handle);
router.post("/adm/session", new AuthAdmController_1.AuthAdmController().handle);
router.post("/adm/cod", new CodRecoveyAdmController_1.CodRecoveyAdmController().handle);
router.put("/adm/recovery", new RecoveryPassAdmController_1.RecoveryPassAdmController().handle);
router.get("/adm/me", AdmMiddlewares_1.AdmMiddlewares, new DetailsAdmController_1.DetailsAdmController().handle);
router.put('/adm/pass', AdmMiddlewares_1.AdmMiddlewares, new ChangePassAdmControlller_1.ChangePassAdmControlller().handle);
router.get("/adm/users", AdmMiddlewares_1.AdmMiddlewares, new NewUsersAdmController_1.NewUsersAdmController().handle);
router.put("/adm/useron", AdmMiddlewares_1.AdmMiddlewares, new ActiveUsersAdmController_1.ActiveUsersAdmController().handle);
router.get("/adm/filter", AdmMiddlewares_1.AdmMiddlewares, new FilterUsersAdmController_1.FilterUsersAdmController().handle);
router.put("/adm/setpayment", AdmMiddlewares_1.AdmMiddlewares, new SetPaymentController_1.SetPaymentController().handle);
router.post("/adm/apt", AdmMiddlewares_1.AdmMiddlewares, new CreateaptAdmController_1.CreateaptAdmController().handle);
router.delete("/adm/apt", AdmMiddlewares_1.AdmMiddlewares, new DeleteAptAdmController_1.DeleteAptAdmController().handle);
router.put("/adm/apt", AdmMiddlewares_1.AdmMiddlewares, new EditAptsAdmController_1.EditAptsAdmController().handle);
router.put("/adm/aptuser", AdmMiddlewares_1.AdmMiddlewares, new ChangeAptControler_1.ChangeAptControler().handle);
router.put("/adm/automation", AdmMiddlewares_1.AdmMiddlewares, new AutomationPaymentController_1.AutomationPaymentController().handle);
router.delete("/adm/account", AdmMiddlewares_1.AdmMiddlewares, new DeleteAccountController_1.DeleteAccountController().handle);
router.post("/adm/towers", AdmMiddlewares_1.AdmMiddlewares, new CreateTowerAdmController_1.CreateTowerAdmController().handle);
router.delete("/adm/towers", AdmMiddlewares_1.AdmMiddlewares, new DeleteTowerAdmController_1.DeleteTowerAdmController().handle);
router.put("/adm/towers", AdmMiddlewares_1.AdmMiddlewares, new EditTowerAdmController_1.EditTowerAdmController().handle);
router.post("/adm/excel", AdmMiddlewares_1.AdmMiddlewares, ExcelAdmController_1.upload.single('excel'), new ExcelAdmController_1.ExcelAdmController().handle);
// routes user ---------------------------------------------------------------------
router.get("/towers", new ListTowersUserController_1.ListTowersUserController().handle);
router.get("/apts", new ListAptUserController_1.ListAptUserController().handle);
router.post("/user", new CreateUserController_1.CreateUserController().handle);
router.post("/session", new AuthUserController_1.AuthUserController().handle);
router.post("/cod", new CodRecoveyUserServices_1.CodRecoveyUserController().handle);
router.put("/recovery", new RecoveryPassUserController_1.RecoveryPassUserController().handle);
router.get("/me", UserMiddlewares_1.UserMiddlewares, new DetailUserController_1.DetailUserController().handle);
router.put("/password", UserMiddlewares_1.UserMiddlewares, new ChangePassUserController_1.ChangePassUserController().handle);
router.put("/photo", UserMiddlewares_1.UserMiddlewares, Multer.single('image'), FirebaseMiddlwere_1.default, new PhotoUserController_1.PhotoUserController().handle);
router.put('/photodelete', UserMiddlewares_1.UserMiddlewares, new DeletePhotoUserController_1.DeletePhotoUserController().handle);
router.delete('/account', UserMiddlewares_1.UserMiddlewares, new DeleteAccountUserController_1.DeleteAccountUserController().handle);
// routes user agendamento ---------------------------------------------------------------------
router.post("/reservations", UserMiddlewares_1.UserMiddlewares, new CreateReservationUserController_1.CreateReservationUserController().handle);
router.get("/allreservations", UserMiddlewares_1.UserMiddlewares, new DateUnavailableController_1.DateUnavailableController().handle);
router.delete("/reservations", UserMiddlewares_1.UserMiddlewares, new DeleteReservationUserController_1.DeleteReservationUserController().handle);
router.get("/myreservations", UserMiddlewares_1.UserMiddlewares, new MyAgendamentosUserController_1.MyAgendamentosUserController().handle);
router.put("/guest", UserMiddlewares_1.UserMiddlewares, new GuestAddController_1.GuestAddController().handle);
router.post("/list", UserMiddlewares_1.UserMiddlewares, new WaitListUserController_1.WaitListUserController().handle);
// routes adm agendamento ---------------------------------------------------------------------
router.get("/adm/reservations", AdmMiddlewares_1.AdmMiddlewares, new NewReservationsAdmController_1.NewReservationsAdmController().handle);
router.put("/adm/setreservations", AdmMiddlewares_1.AdmMiddlewares, new SetNewReservationController_1.SetNewReservationController().handle);
router.get("/adm/actreservations", AdmMiddlewares_1.AdmMiddlewares, new ListReservationsTrueController_1.ListReservationsTrueController().handle);
router.get("/adm/taxed", AdmMiddlewares_1.AdmMiddlewares, new ListAllTaxedAgendamentoController_1.ListAllTaxedAgendamentoController().handle);
router.post("/adm/guets", AdmMiddlewares_1.AdmMiddlewares, new ListGuestController_1.ListGuestController().handle);
router.delete("/adm/reservation", AdmMiddlewares_1.AdmMiddlewares, new DeleteReservationAdmController_1.DeleteReservationAdmController().handle);
