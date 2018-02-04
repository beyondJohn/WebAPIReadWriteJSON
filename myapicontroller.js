using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Script.Serialization;
using Newtonsoft.Json.Linq;

namespace BeyondLogical.Controllers
{

    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class SonyController : ApiController
    {
        public HttpResponseMessage Get()
        {
            string myJSON = "";
            var json = System.Web.HttpContext.Current.Server.MapPath("~/myfile.json");
            using (FileStream mem = new FileStream(json, FileMode.Open))
            {
                using(StreamReader sr = new StreamReader(mem))
                {
                    myJSON = sr.ReadToEnd();
                    sr.Close();
                    sr.Dispose();
                }
                mem.Close();
                mem.Dispose();
            }
                string myDate = DateTime.Now.ToShortDateString();
            return new HttpResponseMessage()
            {
                Content = new StringContent("GET: " + myJSON)
            };
        }

        public HttpResponseMessage Post([FromBody]Booth jsonBody)
        {
            var getArrayOfObjects = jsonBody.mystrings;
            var serializer = new JavaScriptSerializer();
            List<Booth> booths = new List<Booth>();
            foreach (var array in getArrayOfObjects)
            {
                var serializearray = JArray.Parse(array);
                foreach (var myobject in serializearray)
                {
                    var id = "";
                    var name = "";
                    var detail = "";
                    var tryparse = JObject.Parse(myobject.ToString());
                    foreach (var attrs in tryparse)
                    {
                        var mykey = attrs.Key;
                        if(mykey == "id") {
                            id = attrs.Value.ToString();
                        }
                        else if (mykey == "name")
                        {
                            name = attrs.Value.ToString();
                        }
                        else if (mykey == "detail")
                        {
                            detail = attrs.Value.ToString();
                        }

                    }
                    booths.Add(new Booth
                    {
                        id = id,
                        name= name,
                        detail = detail
                    });
                }
                
            }
            var stophere = "";

            var serializedFinal = serializer.Serialize(booths);
            string updatedFileContents = serializedFinal;
            System.IO.File.WriteAllText(System.Web.HttpContext.Current.Server.MapPath("~/myfile.json"), updatedFileContents);
            return new HttpResponseMessage()
            {
                Content = new StringContent(serializedFinal)
            };
        }
    }
}
public class Booths
{
    public List<Booth> booths { get; set; }
}
public class Booth
{
    public string id { get; set; }
    public string name { get; set; }
    public string detail { get; set; }
    public List<string> mystrings { get; set; }
}
