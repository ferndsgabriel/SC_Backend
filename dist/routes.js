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
const ViewDashboardController_1 = require("./Controllers/dashboard/ViewDashboardController");
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
const ReportUserController_1 = require("./Controllers/user/ReportUserController");
// user import agendamento ---------------------------------------------------------------
const CreateReservationUserController_1 = require("./Controllers/reservationUser/CreateReservationUserController");
const DateUnavailableController_1 = require("./Controllers/reservationUser/DateUnavailableController");
const DeleteReservationUserController_1 = require("./Controllers/reservationUser/DeleteReservationUserController");
const MyAgendamentosUserController_1 = require("./Controllers/reservationUser/MyAgendamentosUserController");
const GuestAddController_1 = require("./Controllers/reservationUser/GuestAddController");
const WaitListUserController_1 = require("./Controllers/reservationUser/WaitListUserController");
const ListWithoutAvaliationUserController_1 = require("./Controllers/reservationUser/ListWithoutAvaliationUserController");
const AvaliationUserController_1 = require("./Controllers/reservationUser/AvaliationUserController");
const DeleteGuestController_1 = require("./Controllers/reservationUser/DeleteGuestController");
// adm import agendamento ---------------------------------------------------------------
const NewReservationsAdmController_1 = require("./Controllers/reservationAdm/NewReservationsAdmController");
const SetNewReservationController_1 = require("./Controllers/reservationAdm/SetNewReservationController");
const ListReservationsTrueController_1 = require("./Controllers/reservationAdm/ListReservationsTrueController");
const ListAllTaxedAgendamentoController_1 = require("./Controllers/reservationAdm/ListAllTaxedAgendamentoController");
const DeleteReservationAdmController_1 = require("./Controllers/reservationAdm/DeleteReservationAdmController");
// concierge import ---------------------------------------------------------------
const AuthConciergeController_1 = require("./Controllers/concierge/AuthConciergeController");
const FilterOldReservationsController_1 = require("./Controllers/concierge/FilterOldReservationsController");
const FilterFutureReservationsController_1 = require("./Controllers/concierge/FilterFutureReservationsController");
const FilterTodayReservationsController_1 = require("./Controllers/concierge/FilterTodayReservationsController");
const FilterByIdReservationController_1 = require("./Controllers/concierge/FilterByIdReservationController");
const SetPresenceGuestController_1 = require("./Controllers/concierge/SetPresenceGuestController");
//---------------------------------middlewares----------------------------------------//
const AdmMiddlewares_1 = __importDefault(require("./Middlewares/AdmMiddlewares"));
const UserMiddlewares_1 = __importDefault(require("./Middlewares/UserMiddlewares"));
const ConciergeMiddleware_1 = __importDefault(require("./Middlewares/ConciergeMiddleware"));
const router = (0, express_1.Router)();
exports.router = router;
// routes adm ---------------------------------------------------------------------
router.post("/adm", new CreateAdmController_1.CreateAdmController().handle);
router.post("/adm/session", new AuthAdmController_1.AuthAdmController().handle);
router.post("/adm/cod", new CodRecoveyAdmController_1.CodRecoveyAdmController().handle);
router.put("/adm/recovery", new RecoveryPassAdmController_1.RecoveryPassAdmController().handle);
router.get("/adm/me", AdmMiddlewares_1.default, new DetailsAdmController_1.DetailsAdmController().handle);
router.put('/adm/pass', AdmMiddlewares_1.default, new ChangePassAdmControlller_1.ChangePassAdmControlller().handle);
router.get("/adm/users", AdmMiddlewares_1.default, new NewUsersAdmController_1.NewUsersAdmController().handle);
router.put("/adm/useron", AdmMiddlewares_1.default, new ActiveUsersAdmController_1.ActiveUsersAdmController().handle);
router.get("/adm/filter", AdmMiddlewares_1.default, new FilterUsersAdmController_1.FilterUsersAdmController().handle);
router.put("/adm/setpayment", AdmMiddlewares_1.default, new SetPaymentController_1.SetPaymentController().handle);
router.post("/adm/apt", AdmMiddlewares_1.default, new CreateaptAdmController_1.CreateaptAdmController().handle);
router.delete("/adm/apt", AdmMiddlewares_1.default, new DeleteAptAdmController_1.DeleteAptAdmController().handle);
router.put("/adm/apt", AdmMiddlewares_1.default, new EditAptsAdmController_1.EditAptsAdmController().handle);
router.put("/adm/aptuser", AdmMiddlewares_1.default, new ChangeAptControler_1.ChangeAptControler().handle);
router.put("/adm/automation", AdmMiddlewares_1.default, new AutomationPaymentController_1.AutomationPaymentController().handle);
router.delete("/adm/account", AdmMiddlewares_1.default, new DeleteAccountController_1.DeleteAccountController().handle);
router.post("/adm/towers", AdmMiddlewares_1.default, new CreateTowerAdmController_1.CreateTowerAdmController().handle);
router.delete("/adm/towers", AdmMiddlewares_1.default, new DeleteTowerAdmController_1.DeleteTowerAdmController().handle);
router.put("/adm/towers", AdmMiddlewares_1.default, new EditTowerAdmController_1.EditTowerAdmController().handle);
router.post("/adm/excel", AdmMiddlewares_1.default, ExcelAdmController_1.upload.single('excel'), new ExcelAdmController_1.ExcelAdmController().handle);
router.post("/adm/dashboard", AdmMiddlewares_1.default, new ViewDashboardController_1.ViewDashboardController().handle);
// routes user ---------------------------------------------------------------------
router.get("/towers", new ListTowersUserController_1.ListTowersUserController().handle);
router.get("/apts", new ListAptUserController_1.ListAptUserController().handle);
router.post("/user", new CreateUserController_1.CreateUserController().handle);
router.post("/session", new AuthUserController_1.AuthUserController().handle);
router.post("/cod", new CodRecoveyUserServices_1.CodRecoveyUserController().handle);
router.put("/recovery", new RecoveryPassUserController_1.RecoveryPassUserController().handle);
router.get("/me", UserMiddlewares_1.default, new DetailUserController_1.DetailUserController().handle);
router.put("/password", UserMiddlewares_1.default, new ChangePassUserController_1.ChangePassUserController().handle);
router.put("/photo", UserMiddlewares_1.default, Multer.single('image'), FirebaseMiddlwere_1.default, new PhotoUserController_1.PhotoUserController().handle);
router.put('/photodelete', UserMiddlewares_1.default, new DeletePhotoUserController_1.DeletePhotoUserController().handle);
router.delete('/account', UserMiddlewares_1.default, new DeleteAccountUserController_1.DeleteAccountUserController().handle);
router.post('/report', UserMiddlewares_1.default, new ReportUserController_1.ReportUserController().handle);
// routes user agendamento ---------------------------------------------------------------------
router.post("/reservations", UserMiddlewares_1.default, new CreateReservationUserController_1.CreateReservationUserController().handle);
router.get("/allreservations", UserMiddlewares_1.default, new DateUnavailableController_1.DateUnavailableController().handle);
router.delete("/reservations", UserMiddlewares_1.default, new DeleteReservationUserController_1.DeleteReservationUserController().handle);
router.get("/myreservations", UserMiddlewares_1.default, new MyAgendamentosUserController_1.MyAgendamentosUserController().handle);
router.get("/noavaliation", UserMiddlewares_1.default, new ListWithoutAvaliationUserController_1.ListWithoutAvaliationUserController().handle);
router.put("/guest", UserMiddlewares_1.default, new GuestAddController_1.GuestAddController().handle);
router.delete("/guest", UserMiddlewares_1.default, new DeleteGuestController_1.DeleteGuestController().handle);
router.post("/list", UserMiddlewares_1.default, new WaitListUserController_1.WaitListUserController().handle);
router.put("/avaliation", UserMiddlewares_1.default, new AvaliationUserController_1.AvaliationUserController().handle);
// routes adm agendamento ---------------------------------------------------------------------
router.get("/adm/reservations", AdmMiddlewares_1.default, new NewReservationsAdmController_1.NewReservationsAdmController().handle);
router.put("/adm/setreservations", AdmMiddlewares_1.default, new SetNewReservationController_1.SetNewReservationController().handle);
router.get("/adm/actreservations", AdmMiddlewares_1.default, new ListReservationsTrueController_1.ListReservationsTrueController().handle);
router.get("/adm/taxed", AdmMiddlewares_1.default, new ListAllTaxedAgendamentoController_1.ListAllTaxedAgendamentoController().handle);
router.delete("/adm/reservation", AdmMiddlewares_1.default, new DeleteReservationAdmController_1.DeleteReservationAdmController().handle);
// routes concierge imports
router.post("/concierge", new AuthConciergeController_1.AuthConciergeController().handle);
router.get("/concierge/oldreservations", ConciergeMiddleware_1.default, new FilterOldReservationsController_1.FilterOldReservationsController().handle);
router.get("/concierge/futurereservations", ConciergeMiddleware_1.default, new FilterFutureReservationsController_1.FilterFutureReservationsController().handle);
router.get("/concierge/todayreservations", ConciergeMiddleware_1.default, new FilterTodayReservationsController_1.FilterTodayReservationsController().handle);
router.get('/concierge/reservation', ConciergeMiddleware_1.default, new FilterByIdReservationController_1.FilterByIdReservationController().handle);
router.put('/concierge/presence', ConciergeMiddleware_1.default, new SetPresenceGuestController_1.SetPresenceGuestController().handle);
