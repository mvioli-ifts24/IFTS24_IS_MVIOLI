const AboutPage = () => {
  return (
    <div className="w-80 flex flex-col gap-8 items-center">
      <div
        style={{ backgroundImage: 'url("/logo.png")' }}
        className="h-32 w-32 bg-cover"
      ></div>
      <p className="text-lg">
        <b>Gaming Center</b> es una comunidad sencilla en la que los usuarios
        suben reseñas de los juegos que completan, asi como pueden ver lo subido
        por otros usuarios y/o amigos!.
      </p>
      <p className="text-lg">
        El proyecto fue creado por <b>Martín Violi</b> para la materia de{" "}
        <b>INGENIERIA DE SOFTWARE del IFTS24</b>, dictada por el profesor{" "}
        <b>Julio Cesar Leppen</b>.
      </p>
    </div>
  );
};

export default AboutPage;
