using System.Collections.Generic;
using System.IO;
using System.Web.Script.Serialization;
using System.Web.Mvc;
using BeyondLogical.Models;
using Newtonsoft.Json;

namespace BeyondLogical.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult Sony()
        {
            string myJSON = "";
            var json = System.Web.HttpContext.Current.Server.MapPath("~/myfile.json");
            using (FileStream mem = new FileStream(json, FileMode.Open))
            {
                using (StreamReader sr = new StreamReader(mem))
                {
                    myJSON = sr.ReadToEnd();
                
                }
                
            }
            var parsejson = JsonConvert.DeserializeObject<List<Booth>>(myJSON);

            Booths booths = new Booths();
            booths.booths = new List<Booth>();
            foreach (var mybooth in parsejson)
            {
                booths.booths.Add(new Booth()
                {
                    id = mybooth.id,
                    name = mybooth.name,
                    detail = mybooth.detail
                });
            }

            return View(booths);
        }
        [HttpPost]
        public ActionResult Sony(Booths booths)
        {
            return View();
        }
    }
}
