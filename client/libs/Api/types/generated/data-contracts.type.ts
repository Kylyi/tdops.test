/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Standard API error response containing localized error messages. */
export interface ApiResponseError {
  /**
   * Dictionary of error codes to localized error messages.
   * Key format for FluentValidation errors: "ErrorCode.PropertyName" (e.g., "Global.Required.Username")
   * Key format for ServiceResult/Domain errors: "ErrorCode" (e.g., "Application.AuthorizedPersons.NotFound")
   * Value: Localized error message
   */
  errors: Record<string, string>;
}

export interface AssignedAuthorizedPersonDetailResponse {
  /** @format int32 */
  id?: number;
  operatorCode?: string | null;
  username?: string | null;
}

export interface AssignedAuthorizedPersonResponse {
  authorizedPerson?: AssignedAuthorizedPersonDetailResponse;
  /** @format int32 */
  id?: number;
  isDeputy?: boolean;
}

export interface AuthorizedPersonDocumentResponse {
  /** @format int32 */
  authorizedPersonId?: number;
  documentType?: AuthorizedPersonDocumentType;
  fileUri?: string | null;
  /** @format int32 */
  id?: number;
}

export interface AuthorizedPersonDocumentResponseIReadOnlyListApiResponse {
  payload: AuthorizedPersonDocumentResponse[] | null;
  warnings?: Record<string, string>;
}

/** @format int32 */
export enum AuthorizedPersonDocumentType {
  DirectorResolution = 1,
  NBSCertificate = 2,
}

/** @format int32 */
export enum AuthorizedPersonKind {
  Regular = 1,
  Deputy = 2,
}

export interface AuthorizedPersonListItem {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format int32 */
  id?: number;
  idCard?: string | null;
  isActive?: boolean | null;
  jmbg?: string | null;
  /** @format int32 */
  kind?: number | null;
  note?: string | null;
  operatorCode?: string | null;
  treasuryBranchCode?: string | null;
  treasuryBranchName?: string | null;
  /** @format int32 */
  type?: number | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
  username?: string | null;
}

export interface AuthorizedPersonListItemApiListResponse {
  additionalInformation: Pagin8ResultAdditionalInformation;
  payload: AuthorizedPersonListItemPagin8ResultQueryResult;
}

export interface AuthorizedPersonListItemPagin8ResultQueryResult {
  data?: AuthorizedPersonListItem[] | null;
  /** @format int32 */
  totalRows?: number | null;
}

export interface AuthorizedPersonResponse {
  documents?: AuthorizedPersonDocumentResponse[] | null;
  /** @format int32 */
  id?: number;
  idCard?: string | null;
  isActive?: boolean;
  jmbg?: string | null;
  kind?: AuthorizedPersonKind;
  note?: string | null;
  operatorCode?: string | null;
  treasuryBranchCode?: string | null;
  type?: AuthorizedPersonType;
  username?: string | null;
}

export interface AuthorizedPersonResponseApiResponse {
  payload: AuthorizedPersonResponse;
  warnings?: Record<string, string>;
}

/** @format int32 */
export enum AuthorizedPersonType {
  Cashier = 1,
  VaultKeeper = 2,
  CommissionMember = 3,
  PaymentOperator = 4,
}

export interface AuthorizedPersonsActivateCreateParams {
  /** @format int32 */
  id: number;
}

export interface AuthorizedPersonsDeactivateCreateParams {
  /** @format int32 */
  id: number;
}

export interface AuthorizedPersonsDetailParams {
  /** @format int32 */
  id: number;
}

export interface AuthorizedPersonsDocumentsCreateParams {
  /** @format int32 */
  id: number;
}

export interface AuthorizedPersonsDocumentsListParams {
  /** @format int32 */
  id: number;
}

export interface AuthorizedPersonsUpdateParams {
  /** @format int32 */
  id: number;
}

export interface BusinessDayListItem {
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  date?: string | null;
  /** @format int32 */
  id?: number;
  /** @format int32 */
  numberOfCashRegisters?: number | null;
  /** @format int32 */
  status?: number | null;
  treasuryBranchCode?: string | null;
  treasuryBranchName?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export interface BusinessDayListItemApiListResponse {
  additionalInformation: Pagin8ResultAdditionalInformation;
  payload: BusinessDayListItemPagin8ResultQueryResult;
}

export interface BusinessDayListItemPagin8ResultQueryResult {
  data?: BusinessDayListItem[] | null;
  /** @format int32 */
  totalRows?: number | null;
}

export interface BusinessDayResponse {
  /** @format double */
  cashAccountBalance?: number | null;
  cashAccountNumber?: string | null;
  cashiers?: CashierResponse[] | null;
  /** @format date-time */
  closedAt?: string | null;
  closedBy?: string | null;
  commissionMembers?: AssignedAuthorizedPersonResponse[] | null;
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date */
  date?: string;
  /** @format double */
  handlingLimit?: number | null;
  /** @format date */
  handlingLimitExpirationDate?: string | null;
  /** @format int32 */
  id?: number;
  /** @format int32 */
  numberOfCashRegisters?: number | null;
  /** @format date-time */
  openedAt?: string | null;
  openedBy?: string | null;
  status?: BusinessDayStatus;
  trackedDenominations?: TrackedDenominationResponse[] | null;
  /** @format double */
  transportLimit?: number | null;
  /** @format date */
  transportLimitExpirationDate?: string | null;
  treasuryBranchCode?: string | null;
  treasuryBranchName?: string | null;
  vaultKeepers?: AssignedAuthorizedPersonResponse[] | null;
  /** @format double */
  vaultLimit?: number | null;
  /** @format date */
  vaultLimitExpirationDate?: string | null;
}

export interface BusinessDayResponseApiResponse {
  payload: BusinessDayResponse;
  warnings?: Record<string, string>;
}

/** @format int32 */
export enum BusinessDayStatus {
  Draft = 0,
  Open = 1,
  Closed = 2,
}

export interface BusinessDaysCloseCreateParams {
  /** @format int32 */
  id: number;
}

export interface BusinessDaysDetailParams {
  /** @format int32 */
  id: number;
}

export interface BusinessDaysOpenCreateParams {
  /** @format int32 */
  id: number;
}

export interface BusinessDaysUpdateParams {
  /** @format int32 */
  id: number;
}

/** @format int32 */
export enum CashRegisterDayActivity {
  Active = 1,
  Inactive = 2,
}

/** @format int32 */
export enum CashRegisterDayStatus {
  Open = 1,
  ClosedBalanced = 2,
  ClosedUnbalanced = 3,
}

export interface CashRegisterDenominationResponse {
  /** @format int32 */
  denominationId?: number;
  /** @format int32 */
  quantity?: number;
}

export interface CashRegisterListItem {
  /** @format int32 */
  activity?: number | null;
  /** @format double */
  balance?: number | null;
  /** @format int32 */
  businessDayId?: number | null;
  cashRegisterNo?: string | null;
  /** @format double */
  cashRequestedTotal?: number | null;
  /** @format double */
  cashReturnedTotal?: number | null;
  /** @format int32 */
  cashierPersonId?: number | null;
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  date?: string | null;
  /** @format int32 */
  id?: number;
  operatorCode?: string | null;
  /** @format double */
  paymentFeesTotal?: number | null;
  /** @format double */
  paymentsTotal?: number | null;
  /** @format double */
  payoutFeesTotal?: number | null;
  /** @format double */
  payoutsTotal?: number | null;
  /** @format int32 */
  status?: number | null;
  treasuryBranchCode?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export interface CashRegisterListItemApiListResponse {
  additionalInformation: Pagin8ResultAdditionalInformation;
  payload: CashRegisterListItemPagin8ResultQueryResult;
}

export interface CashRegisterListItemPagin8ResultQueryResult {
  data?: CashRegisterListItem[] | null;
  /** @format int32 */
  totalRows?: number | null;
}

export interface CashRegisterResponse {
  activity?: CashRegisterDayActivity;
  /** @format double */
  balance?: number;
  /** @format int32 */
  businessDayId?: number;
  cashRegisterNo?: string | null;
  /** @format double */
  cashRequestedTotal?: number;
  /** @format double */
  cashReturnedTotal?: number;
  /** @format date */
  date?: string;
  denominations?: CashRegisterDenominationResponse[] | null;
  /** @format int32 */
  id?: number;
  operatorCode?: string | null;
  /** @format double */
  paymentFeesTotal?: number;
  /** @format double */
  paymentsTotal?: number;
  /** @format double */
  payoutFeesTotal?: number;
  /** @format double */
  payoutsTotal?: number;
  status?: CashRegisterDayStatus;
  treasuryBranchCode?: string | null;
}

export interface CashRegisterResponseApiResponse {
  payload: CashRegisterResponse;
  warnings?: Record<string, string>;
}

export interface CashRegistersActivityUpdateParams {
  /** @format int32 */
  id: number;
}

export interface CashRegistersCloseCreateParams {
  /** @format int32 */
  id: number;
}

export interface CashRegistersDetailParams {
  /** @format int32 */
  id: number;
}

export interface CashRequestApprovalRequest {
  approvalRole?: CashRequestApprovalRole;
  /** @format int32 */
  authorizedPersonId?: number;
}

export interface CashRequestApprovalResponse {
  approvalRole?: CashRequestApprovalRole;
  /** @format date-time */
  approvedAt?: string | null;
  /** @format int32 */
  authorizedPersonId?: number;
  /** @format int32 */
  ordinalNumber?: number;
}

/** @format int32 */
export enum CashRequestApprovalRole {
  Receiver = 1,
  Deliverer = 2,
}

/** @format int32 */
export enum CashRequestDirection {
  Withdrawal = 1,
  Deposit = 2,
}

/** @format int32 */
export enum CashRequestKind {
  CashRegister = 1,
  NBS = 2,
  TreasuryBranch = 3,
  Vault = 4,
}

export interface CashRequestLineRequest {
  /** @format int32 */
  denominationId?: number;
  /** @format int32 */
  quantity?: number;
}

export interface CashRequestLineResponse {
  /** @format double */
  amount?: number;
  /** @format int32 */
  denominationId?: number;
  /** @format double */
  denominationValue?: number;
  /** @format int32 */
  quantity?: number;
}

export interface CashRequestListItem {
  /** @format double */
  amount?: number | null;
  cashRegisterNo?: string | null;
  correctionComment?: string | null;
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  /** @format date-time */
  date?: string | null;
  /** @format int32 */
  direction?: number | null;
  /** @format int32 */
  id?: number;
  /** @format int32 */
  kind?: number | null;
  /** @format int32 */
  sequenceNumber?: number | null;
  /** @format int32 */
  status?: number | null;
  treasuryBranchCode?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export interface CashRequestListItemApiListResponse {
  additionalInformation: Pagin8ResultAdditionalInformation;
  payload: CashRequestListItemPagin8ResultQueryResult;
}

export interface CashRequestListItemPagin8ResultQueryResult {
  data?: CashRequestListItem[] | null;
  /** @format int32 */
  totalRows?: number | null;
}

export interface CashRequestResponse {
  /** @format double */
  amount?: number;
  approvals?: CashRequestApprovalResponse[] | null;
  correctionComment?: string | null;
  /** @format date-time */
  createdAt?: string;
  /** @format date */
  date?: string;
  direction?: CashRequestDirection;
  /** @format int32 */
  id?: number;
  kind?: CashRequestKind;
  lines?: CashRequestLineResponse[] | null;
  /** @format int32 */
  sequenceNumber?: number;
  status?: CashRequestStatus;
  treasuryBranchCode?: string | null;
  /** @format date-time */
  updatedAt?: string;
}

export interface CashRequestResponseApiResponse {
  payload: CashRequestResponse;
  warnings?: Record<string, string>;
}

/** @format int32 */
export enum CashRequestStatus {
  Draft = 0,
  Active = 1,
  Executed = 2,
  Cancelled = 3,
}

export interface CashRequestsActivateCreateParams {
  /** @format int32 */
  id: number;
}

export interface CashRequestsApprovalsUpdateParams {
  /** @format int32 */
  id: number;
}

export interface CashRequestsCancelCreateParams {
  /** @format int32 */
  id: number;
}

export interface CashRequestsCorrectCreateParams {
  /** @format int32 */
  id: number;
}

export interface CashRequestsDetailParams {
  /** @format int32 */
  id: number;
}

export interface CashRequestsExecuteCreateParams {
  /** @format int32 */
  id: number;
}

export interface CashierResponse {
  authorizedPerson?: AssignedAuthorizedPersonDetailResponse;
  cashRegisterNo?: string | null;
  /** @format int32 */
  id?: number;
  isDeputy?: boolean;
}

export interface ColumnMetadata {
  flags?: string[] | null;
  name?: string | null;
  properties?: ColumnMetadata[] | null;
  type?: string | null;
}

export interface CorrectCashRequestRequest {
  comment?: string | null;
}

export interface CreateAuthorizedPersonRequest {
  idCard?: string | null;
  jmbg?: string | null;
  kind?: AuthorizedPersonKind;
  note?: string | null;
  type?: AuthorizedPersonType;
  username?: string | null;
}

export interface CreateCashRequestRequest {
  approvals?: CashRequestApprovalRequest[] | null;
  cashRegisterNo?: string | null;
  direction?: CashRequestDirection;
  kind?: CashRequestKind;
  lines?: CashRequestLineRequest[] | null;
}

export interface CreateDenominationRequest {
  isActive?: DenominationActivity;
  kind?: DenominationKind;
  name?: string | null;
  /** @format double */
  value?: number;
}

/** @format int32 */
export enum DenominationActivity {
  Inactive = 0,
  Active = 1,
}

/** @format int32 */
export enum DenominationKind {
  Banknote = 1,
  Coin = 2,
}

export interface DenominationListItem {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  isActive?: number | null;
  /** @format int32 */
  kind?: number | null;
  name?: string | null;
  /** @format double */
  value?: number | null;
}

export interface DenominationListItemApiListResponse {
  additionalInformation: Pagin8ResultAdditionalInformation;
  payload: DenominationListItemPagin8ResultQueryResult;
}

export interface DenominationListItemPagin8ResultQueryResult {
  data?: DenominationListItem[] | null;
  /** @format int32 */
  totalRows?: number | null;
}

export interface DenominationResponse {
  /** @format int32 */
  id?: number;
  isActive?: DenominationActivity;
  kind?: DenominationKind;
  name?: string | null;
  /** @format double */
  value?: number;
}

export interface DenominationResponseApiResponse {
  payload: DenominationResponse;
  warnings?: Record<string, string>;
}

export interface DenominationsDetailParams {
  /** @format int32 */
  id: number;
}

export interface DenominationsUpdateParams {
  /** @format int32 */
  id: number;
}

export interface Int32ApiResponse {
  /** @format int32 */
  payload: number;
  warnings?: Record<string, string>;
}

export interface Pagin8ResultAdditionalInformation {
  columnMeta?: Pagin8ResultColumnMeta;
  defaultFilter: string | null;
}

export interface Pagin8ResultColumnMeta {
  columnHash: string | null;
  columnMetadata: ColumnMetadata[] | null;
}

export interface PaymentOrderCardLineResponse {
  accountNumber?: string | null;
  /** @format double */
  amount?: number;
  cardNumber?: string | null;
  slipNumber?: string | null;
}

export interface PaymentOrderCashLineResponse {
  /** @format double */
  amount?: number;
  /** @format int32 */
  denominationId?: number;
  /** @format double */
  denominationValue?: number;
  /** @format int32 */
  quantity?: number;
}

export interface PaymentOrderCheckLineResponse {
  accountNumber?: string | null;
  /** @format double */
  amount?: number;
  serialNumber?: string | null;
}

export interface PaymentOrderFeeResponse {
  /** @format double */
  amount?: number | null;
  hasFee?: boolean;
  tariffNumber?: string | null;
}

export interface PaymentOrderListItem {
  accountCredit?: string | null;
  accountDebit?: string | null;
  /** @format double */
  amount?: number | null;
  /** @format int32 */
  cashRegisterDayId?: number | null;
  complaintReference?: string | null;
  /** @format date-time */
  createdAt?: string | null;
  createdBy?: string | null;
  creditName?: string | null;
  debitName?: string | null;
  /** @format date-time */
  executedAt?: string | null;
  /** @format date-time */
  expectedPaymentDate?: string | null;
  externalOrderNumber?: string | null;
  /** @format int32 */
  id?: number;
  isInstant?: boolean | null;
  isUrgent?: boolean | null;
  /** @format int32 */
  paymentCode?: number | null;
  /** @format int32 */
  paymentMethod?: number | null;
  purpose?: string | null;
  /** @format date-time */
  sentAt?: string | null;
  /** @format int32 */
  status?: number | null;
  /** @format int64 */
  transactionNumber?: number | null;
  treasuryBranchCode?: string | null;
  /** @format int32 */
  type?: number | null;
  /** @format date-time */
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export interface PaymentOrderListItemApiListResponse {
  additionalInformation: Pagin8ResultAdditionalInformation;
  payload: PaymentOrderListItemPagin8ResultQueryResult;
}

export interface PaymentOrderListItemPagin8ResultQueryResult {
  data?: PaymentOrderListItem[] | null;
  /** @format int32 */
  totalRows?: number | null;
}

export interface PaymentOrderResponse {
  accountCredit?: string | null;
  accountDebit?: string | null;
  /** @format double */
  amount?: number;
  cardLines?: PaymentOrderCardLineResponse[] | null;
  cashLines?: PaymentOrderCashLineResponse[] | null;
  /** @format int32 */
  cashRegisterDayId?: number | null;
  checkLines?: PaymentOrderCheckLineResponse[] | null;
  complaintReference?: string | null;
  /** @format date-time */
  createdAt?: string;
  creditAddress?: string | null;
  creditName?: string | null;
  debitAddress?: string | null;
  debitName?: string | null;
  /** @format date-time */
  executedAt?: string | null;
  /** @format date */
  expectedPaymentDate?: string | null;
  externalOrderNumber?: string | null;
  fee?: PaymentOrderFeeResponse;
  /** @format int64 */
  id?: number;
  isInstant?: boolean;
  isUrgent?: boolean;
  /** @format int32 */
  modelPbo?: number | null;
  /** @format int32 */
  modelPbz?: number | null;
  /** @format int32 */
  paymentCode?: number;
  pbo?: string | null;
  pbz?: string | null;
  purpose?: string | null;
  /** @format date-time */
  sentAt?: string | null;
  status?: PaymentOrderStatus;
  /** @format int64 */
  transactionNumber?: number | null;
  treasuryBranchCode?: string | null;
  type?: PaymentOrderType;
  /** @format date-time */
  updatedAt?: string;
}

export interface PaymentOrderResponseApiResponse {
  payload: PaymentOrderResponse;
  warnings?: Record<string, string>;
}

/** @format int32 */
export enum PaymentOrderStatus {
  Created = 1,
  Sent = 2,
  Executed = 3,
  Failed = 4,
}

/** @format int32 */
export enum PaymentOrderType {
  Transfer = 0,
  Deposit = 1,
  Payout = 2,
}

export interface PaymentOrdersDetailParams {
  /** @format int64 */
  id: number;
}

export interface SetCashRegisterActivityRequest {
  enable?: boolean;
}

export interface TrackedDenominationResponse {
  /** @format int32 */
  denominationId?: number;
  /** @format int32 */
  id?: number;
  /** @format int32 */
  quantity?: number;
  serialNo?: string | null;
  /** @format double */
  value?: number;
}

export interface UpdateAuthorizedPersonRequest {
  idCard?: string | null;
  jmbg?: string | null;
  kind?: AuthorizedPersonKind;
  note?: string | null;
}

export interface UpdateBusinessDayAuthorizedPersonRequest {
  /** @format int32 */
  authorizedPersonId?: number;
  /** @format int32 */
  id?: number | null;
}

export interface UpdateBusinessDayCashierRequest {
  /** @format int32 */
  authorizedPersonId?: number;
  cashRegisterNo?: string | null;
  /** @format int32 */
  id?: number | null;
}

export interface UpdateBusinessDayRequest {
  cashiers?: UpdateBusinessDayCashierRequest[] | null;
  commissionMembers?: UpdateBusinessDayAuthorizedPersonRequest[] | null;
  /** @format double */
  handlingLimit?: number | null;
  /** @format date */
  handlingLimitExpirationDate?: string | null;
  /** @format int32 */
  numberOfCashRegisters?: number | null;
  trackedDenominations?: UpdateBusinessDayTrackedDenominationRequest[] | null;
  /** @format double */
  transportLimit?: number | null;
  /** @format date */
  transportLimitExpirationDate?: string | null;
  vaultKeepers?: UpdateBusinessDayAuthorizedPersonRequest[] | null;
  /** @format double */
  vaultLimit?: number | null;
  /** @format date */
  vaultLimitExpirationDate?: string | null;
}

export interface UpdateBusinessDayTrackedDenominationRequest {
  /** @format int32 */
  denominationId?: number;
  /** @format int32 */
  id?: number | null;
  /** @format int32 */
  quantity?: number;
  serialNo?: string | null;
}

export interface UpdateCashRequestApprovalsRequest {
  approvals?: CashRequestApprovalRequest[] | null;
}

export interface UpdateDenominationRequest {
  isActive?: DenominationActivity;
  kind?: DenominationKind;
  name?: string | null;
  /** @format double */
  value?: number;
}

export interface VaultCashItemResponse {
  /** @format int32 */
  denominationId?: number;
  denominationKind?: DenominationKind;
  /** @format double */
  denominationValue?: number;
  /** @format int32 */
  quantity?: number;
  /** @format double */
  total?: number;
}

export interface VaultCashStateListResponse {
  /** @format double */
  accountBalance?: number | null;
  cashAccountNumber?: string | null;
  treasuryBranchCode?: string | null;
  /** @format date-time */
  updatedAt?: string;
  /** @format double */
  vaultCashTotal?: number;
}

export interface VaultCashStateListResponseIReadOnlyListApiResponse {
  payload: VaultCashStateListResponse[] | null;
  warnings?: Record<string, string>;
}

export interface VaultCashStateResponse {
  /** @format double */
  accountBalance?: number | null;
  cashAccountNumber?: string | null;
  treasuryBranchCode?: string | null;
  /** @format date-time */
  updatedAt?: string;
  vaultCash?: VaultCashItemResponse[] | null;
  /** @format double */
  vaultCashTotal?: number;
}

export interface VaultCashStateResponseApiResponse {
  payload: VaultCashStateResponse;
  warnings?: Record<string, string>;
}

export interface VaultCashStatesDetailParams {
  treasuryBranchCode: string;
}

export interface VaultCashStatesListParams {
  TreasuryBranchCode?: string;
}
