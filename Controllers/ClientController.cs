using SALES_ERP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace SALES_ERP.Controllers
{
    [Route("api/Client")]
    public class ClientController : Controller
    {
        private readonly ApplicationDBContext _db;
        public ClientController(ApplicationDBContext db)
        {
            _db = db;
        }

        [HttpPost]
        [Route("AddClient")]
        public IActionResult AddClient(CustomerData client)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var usreid = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.CustomerData.Where(s => s.Companyname == client.Companyname && s.Companyid == companyid).FirstOrDefault();
                if (data == null)
                {
                    client.Companyid = companyid;
                    _db.CustomerData.Add(client);
                    _db.SaveChanges();

                    var customerid = _db.CustomerData.Where(a => a.Companyname == client.Companyname && a.Companyid == companyid).Select(a => a.Customerid).FirstOrDefault();
                    Logs log = new Logs();
                    log.companyid = companyid;
                    log.date = client.date;
                    log.Description = "CREATE";
                    log.UsreName = username;
                    log.Usreid = usreid;
                    log.VoucherType = "LEDGER";
                    log.VoucherId = Convert.ToString(customerid);
                    _db.Logs.Add(log);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Company is added successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Company is already exist" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("Filldatatable")]
        public IActionResult Filldatatable()
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var data = _db.CustomerData.Where(a => a.Companyid == companyid).ToList().OrderBy(a => a.Companyname);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }

        [Route("getClient")]
        public IActionResult GetClient(int id)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var data = _db.CustomerData.Where(a => a.Customerid == id && a.Companyid == companyid).FirstOrDefault();
                if (data == null)
                {
                    return Json(new { success = false, data = "" });
                }
                else
                {
                    return Json(new { success = true, data = data });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpPost]
        [Route("UpdateClient")]
        public IActionResult UpdateClient(CustomerData client)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var usreid = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.CustomerData.Where(a => a.Companyname == client.Companyname && a.Customerid != client.Customerid && a.Companyid == companyid).FirstOrDefault();
                if (data == null)
                {
                    var temp = _db.CustomerData.Find(client.Customerid);
                    temp.ContactPerson = client.ContactPerson;
                    temp.Companyname = client.Companyname;
                    temp.DealingPerson = client.DealingPerson;
                    temp.Email = client.Email;
                    temp.Phone = client.Phone;
                    temp.Address = client.Address;
                    temp.City = client.City;
                    temp.State = client.State;
                    temp.PAN = client.PAN;
                    temp.GSt = client.GSt;
                    temp.Type = client.Type;
                    temp.Statecode = client.Statecode;
                    temp.openingAmount = client.openingAmount;
                    temp.CrDr = client.CrDr;
                    temp.openingDate = client.openingDate;
                    temp.Companyid = companyid;
                    _db.SaveChanges();

                    Logs log = new Logs();
                    log.companyid = companyid;
                    log.date = client.date;
                    log.Description = "UPDATE";
                    log.UsreName = username;
                    log.Usreid = usreid;
                    log.VoucherType = "LEDGER";
                    log.VoucherId = Convert.ToString(client.Customerid);
                    _db.Logs.Add(log);
                    _db.SaveChanges();

                    List<SalesqDetails> sales_q = new List<SalesqDetails>();
                    sales_q=_db.SalesqDetails.Where(a => a.Ccode == client.Customerid && a.Companyid==companyid).ToList();
                    sales_q.ForEach(a => a.Companyname = client.Companyname);
                    _db.SaveChanges();
                    List<TempSalesqDetails> tempsales_q = _db.TempSalesqDetails.Where(a => a.Ccode == client.Customerid && a.Companyid==companyid).ToList();
                    sales_q.ForEach(a => a.Companyname = client.Companyname);
                    _db.SaveChanges();

                    List<PIdetails> piBill = _db.PIdetails.Where(a => a.BillCCode == client.Customerid && a.Companyid == companyid).ToList();
                    piBill.ForEach(a => a.BillCompanyname = client.Companyname);
                    _db.SaveChanges();
                    List<Temppidata> temppiBill = _db.Temppidata.Where(a => a.BillCCode == client.Customerid && a.Companyid == companyid).ToList();
                    temppiBill.ForEach(a => a.BillCompanyname = client.Companyname);
                    _db.SaveChanges();

                    List<PIdetails> picons = _db.PIdetails.Where(a => a.ConsignCCode == client.Customerid && a.Companyid == companyid).ToList();
                    picons.ForEach(a => a.ConsignCompanyname = client.Companyname);
                    _db.SaveChanges();

                    List<Temppidata> temppicons = _db.Temppidata.Where(a => a.ConsignCCode == client.Customerid && a.Companyid == companyid).ToList();
                    temppicons.ForEach(a => a.ConsignCompanyname = client.Companyname);
                    _db.SaveChanges();


                    List<SOdetails> soBill = _db.SOdetails.Where(a => a.BillCCode == client.Customerid && a.Companyid == companyid).ToList();
                    soBill.ForEach(a => a.BillCompanyname = client.Companyname);
                    _db.SaveChanges();
                    List<TempSOdetails> tempsoBill = _db.TempSOdetails.Where(a => a.BillCCode == client.Customerid && a.Companyid == companyid).ToList();
                    tempsoBill.ForEach(a => a.BillCompanyname = client.Companyname);
                    _db.SaveChanges();

                    List<SOdetails> socons = _db.SOdetails.Where(a => a.ConsignCCode == client.Customerid && a.Companyid == companyid).ToList();
                    socons.ForEach(a => a.ConsignCompanyname = client.Companyname);
                    _db.SaveChanges();
                    List<TempSOdetails> tempsocons = _db.TempSOdetails.Where(a => a.ConsignCCode == client.Customerid && a.Companyid == companyid).ToList();
                    tempsocons.ForEach(a => a.ConsignCompanyname = client.Companyname);
                    _db.SaveChanges();

                    List<DispatchedDetail> dpdetails = _db.DispatchedDetail.Where(a => a.Customerid == client.Customerid && a.Companyid == companyid).ToList();
                    dpdetails.ForEach(a => a.CustomerName = client.Companyname);
                    _db.SaveChanges();
                    List<DispatchedDetail> dpdetails1 = _db.DispatchedDetail.Where(a => a.SupplierId == client.Customerid && a.Companyid == companyid).ToList();
                    dpdetails1.ForEach(a => a.SupplierName = client.Companyname);
                    _db.SaveChanges();


                    List<DODetials> dodetails = _db.DODetials.Where(a => a.SupplierCCode == client.Customerid && a.Companyid == companyid).ToList();
                    dodetails.ForEach(a => a.SupplierCompanyname = client.Companyname);
                    _db.SaveChanges();
                    List<DODetials> dodetails1 = _db.DODetials.Where(a => a.TransportCCode == client.Customerid && a.Companyid == companyid).ToList();
                    dodetails1.ForEach(a => a.TransportName = client.Companyname);
                    _db.SaveChanges();

                    List<DODetials> dodetails2 = _db.DODetials.Where(a => a.Contratorid == client.Customerid && a.Companyid == companyid).ToList();
                    dodetails2.ForEach(a => a.Contractor = client.Companyname);
                    _db.SaveChanges();

                    List<PODetials> Podetails = _db.PODetials.Where(a => a.SupplierCCode == client.Customerid && a.Companyid == companyid).ToList();
                    Podetails.ForEach(a => a.SupplierCompanyname = client.Companyname);
                    _db.SaveChanges();

                    List<PODetials> Podetails1 = _db.PODetials.Where(a => a.ConsignCCode == client.Customerid && a.Companyid == companyid).ToList();
                    Podetails1.ForEach(a => a.ConsignCompanyname = client.Companyname);
                    _db.SaveChanges();

                    List<PODetials> Podetails2 = _db.PODetials.Where(a => a.RecipientCCode == client.Customerid && a.Companyid == companyid).ToList();
                    Podetails2.ForEach(a => a.RecipientCompanyname = client.Companyname);
                    _db.SaveChanges();


                    return Json(new { success = true, message = "Company updated successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Company name is Already Exist" });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteClient")]
        public IActionResult DeleteClient(int Id,DateTime date)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var usreid = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SalesqDetails.Where(a => a.Ccode == Id && a.Companyid == companyid).FirstOrDefault();
                if (data == null)
                {
                    var ClientFromDB = _db.CustomerData.FirstOrDefault(u => u.Customerid == Id && u.Companyid == companyid);
                    if (ClientFromDB == null)
                    {
                        return Json(new { success = false, message = "Error while deleting" });
                    }
                    var custName = ClientFromDB.Companyname;
                    _db.CustomerData.Remove(ClientFromDB);
                    _db.SaveChanges();
                    Logs log = new Logs();
                    log.companyid = companyid;
                    log.date = date;
                    log.Description = "DELETE " + custName;
                    log.UsreName = username;
                    log.Usreid = usreid;
                    log.VoucherType = "LEDGER";
                    log.VoucherId = Convert.ToString(Id);
                    _db.Logs.Add(log);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Company deleted successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Company cannot be deleted! Because it's already used somewhere!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error while deleting:" + ex });
            }
        }


        [HttpPost]
        [Route("AddCompany")]
        public IActionResult AddCompany(string type, CompanyProfile company)
        {
            try
            {

                if (type == "Save")
                {
                    var id = "";
                    StringBuilder builder = new StringBuilder();
                    Enumerable
                       .Range(65, 26)
                        .Select(e => ((char)e).ToString())
                        .Concat(Enumerable.Range(97, 26).Select(e => ((char)e).ToString()))
                        .Concat(Enumerable.Range(0, 10).Select(e => e.ToString()))
                        .OrderBy(e => Guid.NewGuid())
                        .Take(11)
                        .ToList().ForEach(e => builder.Append(e));

                    id = builder.ToString();
                    company.uniquecode = id;

                    _db.CompanyProfile.Add(company);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Company added successfully" });
                }
                else
                {
                    var data = _db.CompanyProfile.Where(a => a.Companyid == company.Companyid).FirstOrDefault();
                    data.Companyname = company.Companyname;
                    data.Email = company.Email;
                    data.FinancialYear = company.FinancialYear;
                    data.GST = company.GST;
                    data.MailingName = company.MailingName;
                    data.PAN = company.PAN;
                    data.Phone = company.Phone;
                    data.Address = company.Address;
                    data.begningdate = company.begningdate;
                    data.financialdate = company.financialdate;
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Company updated successfully" });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [Route("FetchCompanyList")]
        public IActionResult FetchCompanyList()
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var usidd = Request.Cookies["id"];
                int usid = Convert.ToInt32(usidd);
                var com = (from cml in _db.CompanyProfile join cmp in _db.companypermission on cml.uniquecode equals cmp.companyid where cmp.usid == usid && cmp.permission == true select new { companyname = cml.Companyname, financialYear = cml.FinancialYear, uniquecode = cml.uniquecode }).ToList();

                return Json(new { success = true, data = com });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }
        [Route("FetchCompanyListprofile")]
        public IActionResult FetchCompanyListprofile()
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var usidd = Request.Cookies["id"];
                int usid = Convert.ToInt32(usidd);
               List<CompanyProfile> com = _db.CompanyProfile.ToList();

                return Json(new { success = true, data = com });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }

        [Route("FetchCompanyByID")]
        public IActionResult FetchCompanyByID(int companyid)
        {
            try
            {
                var data = _db.CompanyProfile.Where(a => a.Companyid == companyid).FirstOrDefault();
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }


        [HttpDelete]
        [Route("DeleteCompany")]
        public IActionResult DeleteCompany(int Id)
        {
            try
            {
                var ClientFromDB = _db.CompanyProfile.FirstOrDefault(u => u.Companyid == Id);
                if (ClientFromDB == null)
                {
                    return Json(new { success = false, message = "Error while deleting" });
                }
                _db.CompanyProfile.Remove(ClientFromDB);
                _db.SaveChanges();
                return Json(new { success = true, message = "Client deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = true, message = "Error while deleting:" + ex });
            }
        }

        [Route("FilldatatablebyType")]
        public IActionResult FilldatatablebyType(string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.CustomerData.Where(a => a.Type.Contains(type) && a.Companyid == comapnyid).ToList().OrderBy(a => a.Companyname);
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message=ex });

            }
        }


        [Route("SaveCompanyid")]
        public IActionResult SaveCompanyid(string companyid)
        {
            try
            {
                Response.Cookies.Delete("companyid");
                CookieOptions options = new CookieOptions();
                options.Expires = DateTime.Now.AddDays(2);
                Response.Cookies.Append("companyid", companyid, options);

                var usidd = Request.Cookies["id"];
                int usid = Convert.ToInt32(usidd);
                var data = (from us in _db.user join cpp in _db.companypermission on us.usid equals cpp.usid where us.usid == usid && cpp.companyid==companyid select new { roleid = cpp.roleid }).FirstOrDefault();
                if (data != null)
                {
                    Response.Cookies.Delete("roleid");
                    Response.Cookies.Append("roleid",Convert.ToString(data.roleid), options);
                }

                return Json(new { success = true });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }

        [Route("GetCompanyid")]
        public IActionResult GetCompanyid()
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var data = _db.CompanyProfile.Where(a => a.uniquecode == companyid).Select(a => a.Companyname).FirstOrDefault();
                var username = Request.Cookies["username"];

                Response.Cookies.Delete("companyid");
                CookieOptions options = new CookieOptions();
                options.Expires = DateTime.Now.AddDays(2);
                Response.Cookies.Append("companyid", companyid, options);

                var usidd = Request.Cookies["id"];
                var image = Request.Cookies["userimage"];
                int usid = Convert.ToInt32(usidd);
                var data1 = (from us in _db.user join cpp in _db.companypermission on us.usid equals cpp.usid where us.usid == usid select new { roleid = cpp.roleid }).FirstOrDefault();
                if (data != null)
                {

                    Response.Cookies.Append("roleid", Convert.ToString(data1.roleid), options);
                }
                return Json(new { success = true, data = companyid, data1 = data, data2 = username, data3 = image });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }


        [Route("AddVoucherNo")]
        public IActionResult AddVoucherNo(Prefix client)
        {
            try
            {

                var companyid = Request.Cookies["companyid"];
                var data = _db.Prefix.Where(s => s.Type == client.Type && s.Companyid == companyid).FirstOrDefault();
                if (data == null)
                {
                    client.Companyid = companyid;
                    _db.Prefix.Add(client);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Company is added successfully" });
                }
                else
                {
                    data.Type = client.Type;
                    data.Companyid = companyid;
                    data.Prefixname = client.Prefixname;
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Voucher Name is Successfully Updated " });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("FetchVoucherNo")]
        public IActionResult FetchVoucherNo()
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                List<Prefix> data = _db.Prefix.Where(a => a.Companyid == companyid).ToList();
                if (data == null)
                {
                    return Json(new { success = false, data = "" });
                }
                else
                {
                    return Json(new { success = true, data = data });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [Route("AddBank")]
        public IActionResult AddBank(string type, Bank bk)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var data = _db.Bank.Where(a => a.AcoountNo == bk.AcoountNo && a.Companyid == companyid).FirstOrDefault();
                    if (data == null)
                    {
                        bk.Companyid = companyid;
                        _db.Bank.Add(bk);
                        _db.SaveChanges();
                        return Json(new { success = true, message = "Company is added successfully" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Bank details Already Exist" });
                    }
                }
                else
                {
                    var data1 = _db.Bank.Where(a => a.AcoountNo == bk.AcoountNo && a.SrNo != bk.SrNo && a.Companyid == companyid).FirstOrDefault();
                    if (data1 == null)
                    {
                        var data2 = _db.Bank.Where(a => a.SrNo == bk.SrNo).FirstOrDefault();
                        data2.BankName = bk.BankName;
                        data2.Branch = bk.Branch;
                        data2.AccountHolderName = bk.AccountHolderName;
                        data2.ISFC = bk.ISFC;
                        data2.AcoountNo = bk.AcoountNo;
                        bk.Companyid = companyid;
                        _db.SaveChanges();
                        return Json(new { success = true, message = "Updated" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Bank details Already Exist" });
                    }

                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [Route("FetchBankList")]
        public IActionResult FetchBankList()
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                List<Bank> data = _db.Bank.Where(a => a.Companyid == companyid).ToList();
                if (data == null)
                {
                    return Json(new { success = false, data = "" });
                }
                else
                {
                    return Json(new { success = true, data = data });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("FetchBankByID")]
        public IActionResult FetchBankByID(int srno)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var data = _db.Bank.Where(a => a.SrNo == srno && a.Companyid == companyid).FirstOrDefault();
                if (data == null)
                {
                    return Json(new { success = false, data = "" });
                }
                else
                {
                    return Json(new { success = true, data = data });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [HttpDelete]
        [Route("DeleteBank")]
        public IActionResult DeleteBank(int SrNo)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var bank = _db.Bank.Where(u => u.SrNo == SrNo && u.Companyid == companyid).FirstOrDefault();
                if (bank == null)
                {
                    return Json(new { success = false, message = "Error while deleting" });
                }
                _db.Bank.Remove(bank);
                _db.SaveChanges();
                return Json(new { success = true, message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = true, message = "Error while deleting:" + ex });
            }
        }

        [Route("setasDefault")]
        public IActionResult setasDefault(int id)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];

                var data = _db.Bank.Where(a => a.SrNo == id && a.Companyid == companyid).FirstOrDefault();
                data.Defaulter = true;
                _db.SaveChanges();

                List<Bank> data1 = _db.Bank.Where(a => a.SrNo != id && a.Companyid == companyid && a.Defaulter == true).ToList();
                data1.ForEach(a => a.Defaulter = false);
                _db.SaveChanges();
                return Json(new { success = true, message = "Set as default" });


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("FillUser")]
        public IActionResult FillUser(string type)
        {
            try
            {
                var usercode = Request.Cookies["id"];
                List<user> data = _db.user.ToList();
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }

        [HttpPost]
        [Route("AddOpeningBalance")]
        public IActionResult AddOpeningBalance(OpeningBalance op)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
               
                    op.customerid = op.customerid;
                    op.CompanyId = companyid;
                    _db.OpeningBalance.Add(op);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Opening Balance added successfully" });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
       


        [Route("FetchLogs")]
        public IActionResult FetchLogs(string ID,string voucherType)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var usercode = Request.Cookies["id"];
                List<Logs> data = _db.Logs.Where(a => a.companyid == companyid && a.VoucherId == ID && a.VoucherType == voucherType).ToList();
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }

        [Route("fecthOpeningBalance")]
        public IActionResult fecthOpeningBalance(int id)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                List<OpeningBalance> data = _db.OpeningBalance.Where(a => a.CompanyId == companyid && a.customerid==id).ToList();
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }

        [HttpDelete]
        [Route("DeleteOpeningBalance")]
        public IActionResult DeleteOpeningBalance(int customerid, int opid)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var data = _db.OpeningBalance.Where(a =>a.opid ==opid && a.customerid ==customerid && a.CompanyId ==companyid ).FirstOrDefault();
                if (data != null)
                {
                    _db.OpeningBalance.Remove(data);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Company deleted successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Company cannot be deleted! Because it's already used somewhere!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error while deleting:" + ex });
            }
        }

        [Route("UpdateOpeningBalance")]
        public IActionResult UpdateOpeningBalance(int customerid, int opid)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var data = _db.OpeningBalance.Where(a => a.customerid == customerid && a.CompanyId == companyid && a.opid ==opid).FirstOrDefault();
                if (data == null)
                {
                    return Json(new { success = false, data = "" });
                }
                else
                {
                    return Json(new { success = true, data = data });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpPost]
        [Route("UpdateOB")]
        public IActionResult UpdateOB(int customerid, int opid, OpeningBalance op)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var data = _db.OpeningBalance.Where(a => a.customerid == customerid && a.opid == opid && a.CompanyId == companyid).FirstOrDefault();
                if (data != null)
                {
                    var temp = _db.OpeningBalance.Find(opid);
                    temp.invoiceno = op.invoiceno;
                    temp.invoiceDate = op.invoiceDate;
                    temp.pono = op.pono;
                    temp.podate = op.podate;
                    temp.transportid = op.transportid;
                    temp.transportname = op.transportname;
                    temp.grno = op.grno;
                    temp.pterm = op.pterm;
                    temp.DueDate = op.DueDate;
                    temp.debit = op.debit;
                    temp.credit = op.credit;
                    temp.CrDr = op.CrDr;
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Company updated successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Company name is Already Exist" });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

    }
}
